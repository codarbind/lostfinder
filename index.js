const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');


mongoose.connect('mongodb://localhost:27017/userDetails', {useNewUrlParser: true});
const Schema = mongoose.Schema;
const UserSchema = new Schema({
userEmail : String,
userPassword:String,
});

const Model = mongoose.model;

const User = Model('userCredentials',UserSchema);


const app = express();
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.get('/', (req, res)=> {

	var html = "<html> <br> <h2>to sign up</h2> <form method='post' action='/signup'> \
	 <input name='signEmail' placeholder='email address' type='email' id='signEmail'> <br>\
	 <input type='password' placeholder='your password' name='signPassword'> <br><button type='submit' name='signSubmit'>Sign Up</button> </form>\
	  <h2>To log in</h2> \
	  <form method='post' action='/login'><input type='email' required placeholder='your email address' name='logEmail' > <br> <input required placeholder='password' type='password' name='logPassword'>\
	  <br> <input type='submit' name='logIn' value='Log In' > </form><html>";
	res.send('hello, welcome to my sign up and log in endpoints ' + html);
});

app.post('/login', (req, res)=>{


		let logEmail = req.body.logEmail;
		let logPassword = req.body.logPassword;
	
	
	User.find({'userEmail': logEmail}, 'userPassword', function(err, docs){



		if (docs[0] === undefined)  {

						 console.log('this is the error while fetching '+ err);
			
			res.send('no such account found');

			} else {

				let retrievedPass = docs[0].userPassword;

			bcrypt.compare(logPassword, retrievedPass ).then(function(result) {

				if (result) {
								res.send('you are logged in')
							
								} else {
									
									res.send('wrong password');
								}

				});
				
				
			
			}
	});


});

app.post('/signup', (req, res)=>{

let userEmail = req.body.signEmail;
let userPassword = req.body.signPassword;


User.find({'userEmail': userEmail}, 'userPassword', function(err, docs){

if(docs[0]) return res.json('user email exist');

bcrypt.hash(userPassword, 10, function(err, hash){

if (err) return console.log('this is the hash error '+ err);

userPassword = hash;

const newUser = new User({

	userEmail: userEmail,
	userPassword: userPassword,

});

newUser.save((err, results)=>{

	if (err) return console.log('this is the error ' + err);
const token = jwt.sign({ userEmail }, 'TOP_SECRET',{
	expiresIn: 5*24*60*60,
});


res.cookie('jwt', token, {httpOnly: true, maxAge:5*24*60*60*1000}).json('Successfull, okay done');

});

});

});
});

app.listen(3000, ()=>{ console.log('working at 3000')});

