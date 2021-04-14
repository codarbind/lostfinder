import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
	
	signContainer: {
    minWidth: 275,
    border: `10px solid black`,
    background: 'linear-gradient( yellow )',
    minHeight:'50vh',
    marginTop:'50px',
    width:`50%`,
    margin:` auto`,
    marginBottom:'50px',
    overflow:'hidden',
  },
  signInput:{
  	width:` 100%`,
  padding: `12px 20px`,
  margin: `8px 0`,
  display: `inline-block`,
  border: `1px solid #ccc`,
  boxSizing: `border-box`,
  },
  signButton: {
  backgroundColor: `black`,
  color: `yellow`,
  padding: `14px 20px`,
  margin: `8px 0`,
  border: `none`,
  cursor: `pointer`,
  width: `100%`,
}

}));


  let loginMessagesColor ={
    1:'green',
    2:'red',
    3:'red',
   
  }

let messageNumber = 0;

function login(e){
  e.preventDefault();
  var urlencoded;
    urlencoded = new URLSearchParams();
    //get input values
    for (var i = 2; i > 0; i--) {
      let name = document.getElementById(i).name;
      let value = document.getElementById(i).value;
      urlencoded.append(name,value);      
    }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");


var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch(`${process.env.REACT_APP_backEndAPI_URL}/login`, requestOptions)
  .then(response => response.json())
  .then(result => {
    
    if(result.status == 200 && result.token){
      Cookies.set('lfjwt', result.token, { expires: 7 });
      //inform users that login was success before reloading
      document.getElementById('message').innerHTML = result['message'];
      document.getElementById('message').style.color = loginMessagesColor[`${result['id']}`];
      setTimeout(()=>{window.location.replace('/')},5000);
    }else{
      //reply to user that login was not successful
      document.getElementById('message').innerHTML = result['message'];
      document.getElementById('message').style.color = loginMessagesColor[`${result['id']}`];

    }
  })
  .catch(error => {
    //do something
    return error;
  }); 
      }



const Login =()=>{
	 const classes = useStyles();


	return(
		<div className={classes.body}>
		
		<CssBaseline />
		<Typography/>
      {<h3 id={'message'} ></h3>}
        
        <div className={classes.signContainer}>

        <form id={'form'}>
		<h2>Log In</h2>
		 <div >
    <label for="logEmail"><b>Email Address</b></label>
    <input type="email" placeholder="your email address" id={'1'} name="logEmail" required className={classes.signInput}/>

    <label for="logPassword"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" id={'2'} name="logPassword" required className={classes.signInput}/>
    <button type="submit" onClick={login} className={classes.signButton}>Login</button>
    
  </div>

<Grid container spacing={3}>
<Grid item xs={6}>
  <div >
    <Button component={Link} to="/resetpassword" type="button" variant="outlined" size="small">Forgot Password ?</Button>
  </div>
  </Grid>
 <Grid item xs={6}> 
<div >
    <Button component={Link} to="/signup" variant="outlined" size="small"  >Create an Account</Button>
  </div>
 </Grid>
  </Grid>
  	</form>
        </div>
		</div>

		)
}

export default Login