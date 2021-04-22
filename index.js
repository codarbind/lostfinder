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
claims:Array,
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
	status:String,
	dateSettled: String,

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
									//res.status(200).json({message:'something unexpected happened',status:400,id:2,token:null})
								}
							})
			
			}
	});
});


app.post('/signup', (req, res)=>{
let {firstName, lastName, userEmail} = req.body;
let userPassword = null;


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
						? ( 
							res.status(200).json({message:details, randomIdentifier: req.params.pass, status:200, id:'1'})
						  )
														 																	 	 
						: (
					 		res.status(200).json({message:'the link must have expired, please use FORGOT PASSWORD.',status:404,id:2})
					 		
					 	  )										 		
							});
					}
});


app.post('/pass/setpassword',(req,res)=>{
let {password, userEmail, randomIdentifier} = req.body;

if (password && userEmail && randomIdentifier){

//encrypt supplied password
bcrypt.hash(password, 10 , function(err, hash) {

 			 password = hash;
 			
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

	return res.json('bad inputs');
}
});


app.post('/home',(req,res)=>{
	let userEmail = ', you are not logged in.';
	jwt.verify(req.cookies.jwt,'TOP_SECRET' ,function(err,verifiedJwt){
				
			verifiedJwt ? userEmail = verifiedJwt.userEmail : userEmail ;		
	res.render('home',{userObject:userEmail})				
					})
})


app.get('/home',(req,res)=>{
	let userEmail = ', you are not logged in.';
	var auth;
	jwt.verify(req.cookies.jwt,'TOP_SECRET' ,function(err,verifiedJwt){
				
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
			
			res.status(200).json({message:'no such account founD:',status:404,id:3,token:null})
			} else if(docs.nModified ===1) {
			
			setTimeout(()=>(
	User.updateOne({randomIdentifier}, {"$set":{randomIdentifier:null}},{upsert:false}, function (err) {
  			err ? console.log('error while NULLing randomIdentifier:',err):  console.log("Successful deletion");
			})),120000);
			res.status(200).json({message:'A reset link has been sent to the provided email address, please click on it to reset your password', id:1,status:200});
					
			}else{
					res.status(200).json({message:'wrong details',status:400,id:2})
				}		
	});
});

app.post('/reportitem',(req,res)=>{

	let {itemName, shortD, location, date, type, reporter, status, token} = req.body;

	token ?  (

				jwt.verify(token,'TOP_SECRET' ,function(err,verifiedJwt){
					
	verifiedJwt ? reporter = verifiedJwt.userEmail : res.json({message:'you must log in to report items',id:'3'}) ;
	
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

if (err) { console.log('error while submitting new item',err);}


res.json({message:'item reported Successfully',id:'1'});

User.update({userEmail: results.reporter},{"$push":{claims:results._id}},function(err,results){
	
});

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

app.post('/claimitem',(req,res)=>{

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

											userEmail = userEmail.replace(/[*]/g,".");
											User.updateOne({userEmail},{"$push":{claims: new ObjectId(id)}},function(err,docs){

												if(docs){
													
													res.json({message:'Returning process has been initiated, you\'ll get update via email and dashboard',id:'1'});
												} else{
													
													return res.json({message:'that did not get through, try again please',id:'2'})
												}

											});
											//return res.json({message:'Your claim has been initiated, you\'ll get update via email and dashboard',id:'1'});
										} else{
											
											return res.json({message:'that did not get through, try again please',id:'2'})
										}
									});

					//update the reporter about this claim

					//send reporter and claimer mail
					}	
				});
				}

				});

	} else{
		return res.json({message:'you need to sign in',id:'2'});
	}


});


app.post('/returnitem',(req,res)=>{

	let {id,token,location,when,description}=req.body;
	let verifiedJwt =  confirmtoken(token);
	
	if(!(id && location && when && description)){
		return res.json({message:'incomplete inputs',id:'2'});
	}else if (verifiedJwt){

		let {userEmail} = verifiedJwt;
		

		//confirm if user returning is the one who lost that item
				Item.find({"$and":[{_id:new ObjectId(id),reporter:{"$eq":userEmail}}]},{userEmail:1},function(err,docs){
			
					if(docs.length ==1){
						
						return res.json({message:"you cannot return an item you lost",id:'2'});

				} else {
					//search if user has returned this item earlier
								//change period to asterik since you cannot deep search with a key with period in its name
									userEmail = userEmail.replace(/[.]/g,"*"); 

									let claimObject = `claims.${userEmail}`;

					Item.find({"$and":[{_id:new ObjectId(id),[claimObject]:{"$exists":true}}]},function(err,docs){
		
					if(docs.length == 1){
					claimedBefore = true;
					return res.json({message:"you can only return an item once",id:'2'});
					}	else{
					Item.updateOne({_id: new ObjectId(id)},{"$set":{[claimObject]:{'itemDescription':description,'whereFound':location,'whenSeen':when,'dateReturned':Date()}}},function(err,docs){
									
										if(docs){
										
											userEmail = userEmail.replace(/[*]/g,".");
											User.updateOne({userEmail},{"$push":{claims: new ObjectId(id)}},function(err,docs){

												if(docs){
												
													res.json({message:'Returning process has been initiated, you\'ll get update via email and dashboard',id:'1'});
												} else{
												
													return res.json({message:'that did not get through, try again please',id:'2'})
												}

											});
											
										} else{
											
											return res.json({message:'that did not get through, try again please',id:'2'})
										}
									});

					//update the reporter about this claim

					//send reporter and returner mail
					}	
				});
				}

				});

	} else{
		return res.json({message:'you need to sign in',id:'2'});
	}


});

app.get('/dashboarditems/:token',(req,res)=>{

	let {token} = req.params;

	let verifiedJwt = confirmtoken(token);

	if(!verifiedJwt){
		res.json({message:'you need to log in to view dashboard items',status:'2'});
	}else{
		let items = [];
		let {userEmail} = verifiedJwt;
		User.find({userEmail},{claims:1,reporter:1},function(err,ObjectIds){
			
			let aggregatedSearchObjectIds = [];
			let generatedItems = ObjectIds[0].claims.map(objectid=>{
				aggregatedSearchObjectIds.push({'_id':objectid});
				});
			/*
				only users that reported a particular item should see all claims on the items, in their dashboard,
				users who are just 'claimers' of an item should only see their claim on that item 
			*/

				
				Item.find({"$or":aggregatedSearchObjectIds},{type:1,name:1,description:1,claims:1,reporter:1,status:1,dateSettled:1},function(err,item){
					let numberOfItems = item.length;

					let newItemArray = [];
			

					for (var i = numberOfItems -1; i >= 0; i--) {
								let {claims,description,name,reporter,type,_id,status,dateSettled} = item[i];
								let newItem = {claims,description,name,reporter,type,_id,status,dateSettled,userEmail};
								
							if(userEmail != newItem.reporter){//if current user is not the reporter
												let userClaim = {}; //
												userEmail1 = userEmail.replace(/[.]/g,"*");
												userClaim[userEmail1] = newItem.claims[userEmail1];//pick out only current users claim
												newItem.claims = userClaim; //then delete/overwrite all other claims
												/*var notOwner ={owner: false};
												var owner = {owner:true};*/
												
												if(newItem.type == 'lost'){
														var obj = {type:'lost',owner:false,reporter:false};
														newItem.type =obj;//'lost'+'-'+false;
														newItemArray.push(newItem);
										
													}else if(newItem.type == 'found'){
														var obj ={type:'found',owner:true,reporter:false};
														newItem.type =obj; //'found'+'-'+true;
														newItemArray.push(newItem);
													}

												(i == 0)?res.json({dashboarditems:newItemArray}):i;

												}else{//you are the reporter
													if(newItem.type == 'lost'){
														var obj = {type:'lost',owner:true,reporter:true};
														newItem.type =obj//'lost'+'-'+true;
														newItemArray.push(newItem);
													
													}else if(newItem.type == 'found'){
														var obj = {type:'found',owner:false,reporter:true};
														newItem.type =obj//'found'+'-'+false;
														newItemArray.push(newItem);
														
													}
													(i == 0)?res.json({dashboarditems:newItemArray}):i;
													
												}

											}				

					});

				});
			}
		});

app.post('/decideonitem',(req,res)=>{
let {_id,decision,token,position,status} = req.body;
console.log('ssta',status);
let verifiedJwt = confirmtoken(token);
let userEmail = verifiedJwt.userEmail;

Item.find({"$and":[{"_id":{"$eq":_id},"reporter":{"$eq":userEmail}}]},function(err,docs){
	err?console.log(err):console.log(docs);
	let numberOfItem = docs.length;
	if(!err && ( numberOfItem === 1)){
		let claimsArray = Object.entries(docs[0].claims);
		//get all the email that has claimed this item
			let emailOfClaimers =[];
			for (let i = 0; i <= claimsArray.length - 1; i++) {
			
				emailOfClaimers.push(claimsArray[i][0].replace(/[.]/g,"*"));
				
			}
		//
		
		let claimerEmail = emailOfClaimers[position]; 

		let decisionFieldToUpdate = `claims.${claimerEmail}.status` ;
		let statusDate = `claims.${claimerEmail}.statusDate` ;

		Item.updateOne({"$and":[{"_id":{"$eq":_id},"status":{"$ne":"settled"},"reporter":{"$eq":userEmail}}]},{"$set":{[decisionFieldToUpdate]:decision,"status":status,dateSettled: Date(),[statusDate]:Date()}},function(err,newDoc){
			if(!err && newDoc.nModified === 1){
				console.log('here',newDoc);
				res.json({message: 	`Claim ${decision} successfully`});
			}else if(!err && newDoc.nModified === 0){
				res.json({message:'Failed! \n You had decided on this item. \n Or the item has been settled in another claim instance.'});
			}
		});
		
	} else{

		res.json({message:'that did not go well'});
	}
});


});

app.listen(4000, ()=>{ console.log('working at 4000')});

