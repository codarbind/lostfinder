const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const cors = require('cors');
require('dotenv').config();
const {  ObjectId} = require('mongodb');

const db = mongoose.connect('mongodb://localhost:27017/userDetails', {useNewUrlParser: true});
const Schema = mongoose.Schema;
const UserSchema = new Schema({
firstName: String,
lastName: String,
userEmail : String,
userPassword:String,
randomIdentifier:Number,
regDate:String,
});
const ItemSchema = new Schema({
	name: String,
	description: String,
	location: String,
	date: String,
	type: String,
	dateReported: String,
	reporter: String,
	claims:Object,

});

const Model = mongoose.model;
const User = Model('usercredentials',UserSchema);
const Item = Model('items', ItemSchema);


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('html'));
app.use(cors({origin:true,credentials:true}));

function confirmtoken(token){
	return jwt.verify(token,'TOP_SECRET' ,function(err,verifiedJwt){
		return verifiedJwt;
						})

}


app.get('/', (req, res)=> {
	let userEmail = ', you are not logged in.';
	jwt.verify(req.cookies.jwt,'TOP_SECRET' ,function(err,verifiedJwt){
	verifiedJwt ? userEmail = verifiedJwt.logEmail : userEmail ;
	res.redirect('home')
					})
});


app.post('/login', (req, res)=>{
		let {logEmail, logPassword} = req.body;

		User.find({'userEmail': logEmail}, {userPassword:1,firstName:1}, function(err, docs){
		if (docs[0] === undefined)  {
			console.log('this is the error while fetching '+ err);
			res.status(200).json({message:'no such account founD:',status:404,id:2,token:null})
			} else {
				let {userPassword, firstName} = docs[0];

				/*/encrypt supplied password
				  bcrypt.hash(logPassword, 10 , function(err, hash) {
       						 logPassword = hash;
  					  });

				/*///compare crypted password

				bcrypt.compare(logPassword, userPassword ).then(function(result) {

				if (result){

									const token = jwt.sign(
												{ userEmail:logEmail,firstName }, 
												'TOP_SECRET',
												{expiresIn: 5*24*60*60}
														);
									res.status(200).json({token,message:'Login Successfull, taking you to the home page!!!', id:1,status:200});
									
								} else{
									res.status(200).json({message:'wrong details',status:400,id:2,token:null})
									res.status(200).json({message:'something unexpected happened',status:400,id:2,token:null})
								}
							})
			
			}
	});
});


app.post('/signup', (req, res)=>{
let {firstName, lastName, userEmail} = req.body;
let userPassword = null;
console.log(`${userEmail} ${userPassword}`);

if (userEmail){

User.find({'userEmail': userEmail}, 'userPassword', function(err, docs){

if(docs[0]) return res.status(409).json({status:409,id:3,message:'user email exist'});
let randomIdentifier = Math.floor(Math.random()*100000);
const newUser = new User({

	firstName,
	lastName,
	userEmail,
	userPassword,
	randomIdentifier,
	regDate: Date(),

});
newUser.save((err, results)=>{
	if (err) return console.log('this is the error ' + err);
	console.log('sign up successful, this is your email: Welcome to Lostfinder kindly set your password by visiting this link: localhost:4000/pass/'+ randomIdentifier);
res.status(201).json({status:201, id:1,message:'sign up successful, this is your email: Welcome to Lostfinder kindly set your password by visiting this link: localhost:4000/pass/'+ randomIdentifier});
});
setTimeout(()=>(
	User.deleteOne({randomIdentifier}, function (err) {
  err ? console.log(err):  console.log("Successful deletion");
})),40*60*1000);//40mins
});} else{
	console.log('bad inputs');
	res.json('bad inputs');
}
});


app.get('/pass/:pass',(req,res)=>{
	if(!req.params.pass){
		res.json('we did not get any parameter o');
	} else {
	var passCheck = User.find({randomIdentifier:req.params.pass})
					 .then(details =>{
						details.length === 1
						? ( console.log('item found, please confirm if your name is '+ details[0].firstName),
							//res.render('setpassword',{details})
							res.status(200).json({message:details, randomIdentifier: req.params.pass, status:200, id:'1'})
						  )
														 																	 	 
						: (console.log('the link must have expired, '),
					 		res.status(200).json({message:'the link must have expired, please use FORGOT PASSWORD.',status:404,id:2})
					 		
					 	  )										 		
							});
					}
});


app.post('/pass/setpassword',(req,res)=>{
let {password, userEmail, randomIdentifier} = req.body;
console.log('userEmail',userEmail);
if (password && userEmail && randomIdentifier){

//encrypt supplied password
bcrypt.hash(password, 10 , function(err, hash) {

 			 password = hash;
 			 console.log('hash',hash,'password',password);
 			 User.updateOne({"$and":[{userEmail, randomIdentifier}]}, {"$set":{userPassword:password, randomIdentifier: null}},{upsert:false}, function(err,doc){
	console.log('err finding signup user',err);
	if (err) return res.json({message:'not set'});

	if (doc.nModified === 1){
		User.find({userEmail}, {firstName:1,userEmail:1},function(err,doc){
			let {userEmail,firstName} = doc[0];
const token = jwt.sign(
								{ userEmail, firstName}, 
								'TOP_SECRET',
								{expiresIn: 5*24*60*60}//5days
								);
		let cookJwt = res.cookie('jwt', token, {httpOnly: true, maxAge:5*24*60*60*1000});
		res.status(200).json({message:'password set successful taking you to home page',status:200,id:1,token});
		//res.redirect('/home');
		});
		
	}
});
  		  });


} else{
	console.log('bad inputs');
	return res.json('bad inputs');
}
});


app.post('/home',(req,res)=>{
	let userEmail = ', you are not logged in.';
	jwt.verify(req.cookies.jwt,'TOP_SECRET' ,function(err,verifiedJwt){
					console.log(verifiedJwt); 
			verifiedJwt ? userEmail = verifiedJwt.userEmail : userEmail ;		
	res.render('home',{userObject:userEmail})				
					})
})


app.get('/home',(req,res)=>{
	let userEmail = ', you are not logged in.';
	var auth;
	jwt.verify(req.cookies.jwt,'TOP_SECRET' ,function(err,verifiedJwt){
					console.log(verifiedJwt); 
			verifiedJwt ? (userEmail = verifiedJwt.userEmail, auth = true) : (userEmail, auth = false) ;		
	//res.render('home',{userObject:userEmail})	
	let userObject = {userEmail,auth};
	res.json(userObject);	
					})
})


app.get('/signout',(req,res)=>{
	res.cookie('jwt', null);
	let userEmail = ', you are not logged in.';
	res.redirect('home')
})

app.get('/auth', (req,res)=>{
	res.render('auth');
})



app.post('/confirmtoken',(req,res)=>{

	let {token} = req.body;
		let verifiedJwt = confirmtoken(token);
		
		verifiedJwt ? (res.json({verifiedJwt, auth:true}) ) : (res.json({auth:false,verifiedJwt})) ;
})

app.get('/test',(req,res)=>{

	User.find({},(err,results)=>{
		res.json(results);
	});

});

app.post('/resetpassword',(req,res)=>{
let {userEmail} =req.body;
let randomIdentifier;

if (!userEmail){
	return res.json({message:'bad inputs',status:400,id:2})
}else{
	randomIdentifier = Math.floor(Math.random()*100000)
}
//!userEmail? (return res.json({message:'bad inputs',status:400,id:2})) : (randomIdentifier = Math.floor(Math.random()*100000));

User.updateOne({userEmail}, {"$set":{randomIdentifier}},{upsert:false}, function(err, docs){
		if (docs.nModified === 0)  {
			console.log('this is the error while fetching '+ err);
			res.status(200).json({message:'no such account founD:',status:404,id:3,token:null})
			} else if(docs.nModified ===1) {
			console.log(`to reset your password, click on >>> http://localhost:3000/pass/${randomIdentifier}`);
			setTimeout(()=>(
	User.update({randomIdentifier}, {"$set":{randomIdentifier:null}},{upsert:false}, function (err) {
  			err ? console.log('error while NULLing randomIdentifier:',err):  console.log("Successful deletion");
			})),120000);
			res.status(200).json({message:'A reset link has been sent to the provided email address, please click on it to reset your password', id:1,status:200});
					
			}else{
					res.status(200).json({message:'wrong details',status:400,id:2})
				}		
	});
});

app.post('/reportitem',(req,res)=>{

	console.log(req.body);
	let {itemName, shortD, location, date, type, reporter, status, token} = req.body;

	token ?  (

				jwt.verify(token,'TOP_SECRET' ,function(err,verifiedJwt){
					
	verifiedJwt ? reporter = verifiedJwt.userEmail : res.json({message:'you must log in to report items',id:'3'}) ;
	console.log({itemName, shortD, location, date, type, reporter, status, token});
					})

		) : res.json({message:'you have to log in to report items',id:'3'});

	const newItem = new Item({


		name:itemName,
		description:shortD,
		location,
		date,
		type,
		reporter,
		status,
		dateReported: Date(),


});

	if (!(itemName && shortD && location && date && type && reporter)){ return res.json({message:'bad inputs',id:'2'})};
newItem.save((err, results)=>{

if (err) return console.log('error while submitting new item',err);

console.log('item reported Successfully');
res.json({message:'item reported Successfully',id:'1'});

});

});

app.get('/items/:type',(req,res)=>{

	let {type} = req.params;
	
	Item.find({type},(err,docs)=>{
		res.json(docs);
		
	});

});

app.get('/itemid/:id',(req,res)=>{

	let {id} = req.params;
	Item.find({'_id': new ObjectId(id)},{name:1,description:1},function(err,docs){

		res.json({item:docs});

	});

});

app.post('/claim',(req,res)=>{

	let {id,token,location,when,description}=req.body;
	let verifiedJwt =  confirmtoken(token);
	
	if(!(id && location && when && description)){
		return res.json({message:'incomplete inputs',id:'2'});
	}else if (verifiedJwt){

		let {userEmail} = verifiedJwt;
		

		//confirm if user claiming is the one who reported that item
				Item.find({"$and":[{_id:new ObjectId(id),reporter:{"$eq":userEmail}}]},{userEmail:1},function(err,docs){
			
					if(docs.length ==1){
						
						return res.json({message:"you cannot claim an item you reported",id:'2'});

				} else {
					//search if user has claimed this item earlier
								//change period to asterik since you cannot deep search with a key with period in its name
									userEmail = userEmail.replace(/[.]/g,"*"); 

									let claimObject = `claims.${userEmail}`;

					Item.find({"$and":[{_id:new ObjectId(id),[claimObject]:{"$exists":true}}]},function(err,docs){
		
				
					if(docs.length == 1){
					claimedBefore = true;
					return res.json({message:"you can only claim an item once",id:'2'});
					}	else{
					Item.updateOne({_id:new ObjectId(id)},{"$set":{[claimObject]:{'itemDescription':description,'possibleLostLocations':location,'lastSeen':when,'dateClaimed':Date()}}},function(err,docs){
										if(docs){
											return res.json({message:'Your claim has been initiated, you\'ll get update via email and dashboard',id:'1'});
										} else{
											console.log('err claiming',err);
											return res.json({message:'that did not get through, try again please',id:'2'})
										}
									});
					}	
				});
				}

				});

	} else{
		return res.json({message:'you need to sign in',id:'2'});
	}


});


app.listen(4000, ()=>{ console.log('working at 4000')});

