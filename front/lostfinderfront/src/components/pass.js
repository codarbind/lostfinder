import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
	 root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
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

let passMessages ={
  0:"loading...",
  1:"Password set successfully, taking you to the home page now, congrats!!",
  2:"the link has expired, please try signing up again",
 
  }

  let passMessagesColor ={
    0:'white',
    1:'green',
    2:'red',
    3:'red',
    
  }

let messageNumber = 0;
let userEmail;

function setPassword(e){
  e.preventDefault();
  var urlencoded, setPasswordInputs;
    urlencoded = new URLSearchParams();
    
    console.log('userEmail front',userEmail);
    //get input values
    for (var i = 3; i > 0; i--) {
      let name = document.getElementById(i).name;
      let value = document.getElementById(i).value;
      urlencoded.append(name,value);
      i == 1? userEmail = value: console.log('i != 1') ;
      
    }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");


var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch(`${process.env.REACT_APP_backEndAPI_URL}/pass/setpassword`, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result,result.status);
    if(result.status == 200 && result.token){
      Cookies.set('lfjwt', result.token, { expires: 7 });
      console.log('after cookie',result.token);
      //set timeout to inform user password set is successful, before reloading
      document.getElementById('message').innerHTML = result['message'];
      document.getElementById('message').style.color = passMessagesColor[`${result['id']}`];
      setTimeout(()=>{window.location.replace('http://localhost:3000/')},5000);
      
    } else{
      //show message in console to users
      console.log('Password was not set, the link might have expired. Please try again.')
    }

  })
  .catch(error => console.log('error', error)); 
      }



const Pass = () =>{

  let path = window.location['pathname'];
  let lastIndex = path.lastIndexOf('/');
  let token = path.slice(lastIndex + 1)
  console.log('here is the tokenPass ',token);

	 const classes = useStyles();
   const [isLoaded, setIsLoaded] = React.useState(false);
   const [items,setItems] = React.useState([]);

//get input values
let setPasswordInputs = {};
function getValue(e){
  let value = e.target.value;
  let name = e.target.name;
  setPasswordInputs[name] = value;
}

          const url = `${process.env.REACT_APP_backEndAPI_URL}/pass/`+token;
            React.useEffect(() =>{
            fetch(url,{method:'get'})
                               .then(res => res.json())
                               .then(
                                 (result)=>{
                                   setIsLoaded(true);
                                   setItems(result);
                                   console.log('here is the api res ',result);
                                   messageNumber = result.id;
                                   if(result.status ==404){
                                    document.getElementById('message').innerHTML = result.message;
                                    document.getElementById('form').style.display = 'none';
                                    document.getElementById('message').style.color = passMessagesColor[messageNumber];
                                    
                                   } else{
                                   userEmail = result.message[0].userEmail;
                                   let randomIdentifier = result.message[0].randomIdentifier;
                                   document.getElementById('1').value = userEmail;
                                   document.getElementById('2').value = randomIdentifier;
                                   document.getElementById('2').style.display = 'none'
                                     }
                                 },
                                 (error) => {console.log('this is the error ',error);}
                                 )
                               .catch(error => console.log('error', error));
                                  },[]);

           
                 
	return(
		<div  className={classes.body}>
		<CssBaseline />
		<Typography/>
    
    {<h3 id={'message'} style={{color:`${passMessages[messageNumber]}`}}></h3>}
    {(isLoaded && (<div id='frame' className={classes.signContainer}>
   
    <form id={'form'} >
    <h2>Reset Password</h2>
   
     <div >
     
    <label for="userEmail"><b>Email Address</b></label>
    <input type="email" placeholder="your email address" id='1' name="userEmail" required className={classes.signInput} readOnly/> 
    <input type="text" id='2' name="randomIdentifier" className={classes.signInput} hidden/>
    <label for="password"><b>Password</b></label>
    <input type="password" placeholder="enter desire password" id='3' name="password" required className={classes.signInput} onChange={getValue}/>
    <button type="submit" id='4' className={classes.signButton} onClick={setPassword}>Set Password</button>
    </div>
    </form>
    </div>) || !isLoaded && (<CircularProgress id={'loader'} size={100} thickness={20} style={{color:'black'}}/>) )}

    </div>
		)
}


export default Pass