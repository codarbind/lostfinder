const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const ejs = require('ejs');

const db = mongoose.connect('mongodb://localhost:27017/userDetails', {useNewUrlParser: true});
const Schema = mongoose.Schema;
const UserSchema = new Schema({
firstName: String,
lastName: String,
userEmail : String,
userPassword:String,
randomIdentifier:Number,
});
const Model = mongoose.model;
const User = Model('usercredentials',UserSchema);


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('html'));


app.get('/', (req, res)=> {
	let userEmail = ', you are not logged in.';
	jwt.verify(req.cookies.jwt,'TOP_SECRET' ,function(err,verifiedJwt){
	verifiedJwt ? userEmail = verifiedJwt.logEmail : userEmail ;
	res.redirect('home')
					})
});


app.post('/login', (req, res)=>{
		let logEmail = req.body.logEmail;
		let logPassword = req.body.logPassword;
		console.log(`${logEmail} and ${logPassword}`);
		User.find({'userEmail': logEmail}, 'userPassword', function(err, docs){
		if (docs[0] === undefined)  {
			console.log('this is the error while fetching '+ err);
			res.send('no such account found');
			} else {
				let retrievedPass = docs[0].userPassword;
				if (logPassword === retrievedPass) {
					const token = jwt.sign(
											{ userEmail:logEmail }, 
											'TOP_SECRET',
											{expiresIn: 5*24*60*60}
										);
					res.cookie('jwt', token, {httpOnly: true, maxAge:5*24*60*60*1000});
					res.render('home',{userObject:logEmail})
				}else{
					res.send('wrong details')
				}

			/*bcrypt.compare(logPassword, retrievedPass ).then(function(result) {

				if (result) {

					const token = jwt.sign(
											{ logEmail }, 
											'TOP_SECRET',
											{expiresIn: 5*24*60*60}

										);


					res.cookie('jwt', token, {httpOnly: true, maxAge:5*24*60*60*1000}).json('Successfull, okay done');

					/*jwt.verify(req.cookies.jwt,'TOP_SECRET' ,function(err,verifiedJwt){
					console.log(verifiedJwt); 
					})

					if(verifiedJwt.userEmail===logEmail){
						res.send('you are logged in')
					} else { 
						res.send('kindly log in with ', logEmail)
					}*../

							
								} else {
									
									res.send('wrong password');
								}

				}); */
				
				
			
			}
	});
});


app.post('/signup', (req, res)=>{
let {firstName, lastName, userEmail} = req.body;
let userPassword = null;
console.log(`${userEmail} ${userPassword}`);
User.find({'userEmail': userEmail}, 'userPassword', function(err, docs){
if(docs[0]) return res.json('user email exist');
let randomIdentifier = Math.floor(Math.random()*100000);
const newUser = new User({

	firstName,
	lastName,
	userEmail,
	userPassword,
	randomIdentifier,

});

newUser.save((err, results)=>{
	if (err) return console.log('this is the error ' + err);
	console.log('sign up successful, this is your email: Welcome to Lostfinder kindly set your password by visiting this link: localhost:3000/pass/'+ randomIdentifier);
res.send('sign up successful, this is your email: Welcome to Lostfinder kindly set your password by visiting this link: localhost:3000/pass/'+ randomIdentifier);
});
setTimeout(()=>(
	User.deleteOne({randomIdentifier}, function (err) {
  if(err) console.log(err);
  console.log("Successful deletion");
})),120000);
});
});


app.get('/pass/:pass',(req,res)=>{
	if(!req.params.pass){
		res.json('do something with the password');
	} else {
	var passCheck = User.find({randomIdentifier:req.params.pass})
					 .then(details =>{
						details.length === 1
						? ( console.log('item found, please confirm if your name is '+ details[0].firstName),
							res.render('setpassword',{details})
						  )
														 																	 	 
						: (console.log('the link must have expired, please try signin up again'),
					 		res.json('the link must have expired, please try signin up again')
					 	  )										 		
							});
					}
});


app.post('/pass/setpassword',(req,res)=>{
const {password, userEmail} = req.body;
User.updateOne({userEmail}, {"$set":{userPassword:password, randomIdentifier: null}},{upsert:false}, function(err){
	const token = jwt.sign(
							{ userEmail }, 
							'TOP_SECRET',
							{expiresIn: 5*24*60*60}
							);
	let cookJwt = res.cookie('jwt', token, {httpOnly: true, maxAge:5*24*60*60*1000});
	res.redirect('/home');
});
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
	jwt.verify(req.cookies.jwt,'TOP_SECRET' ,function(err,verifiedJwt){
					console.log(verifiedJwt); 
			verifiedJwt ? userEmail = verifiedJwt.userEmail : userEmail ;		
	res.render('home',{userObject:userEmail})				
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


app.listen(3000, ()=>{ console.log('working at 3000')});

