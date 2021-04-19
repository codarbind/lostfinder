import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Cookies from 'js-cookie';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


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


function claim(e,itemId){
  alert(`itemid ${itemId}`);
  e.preventDefault();
  var urlencoded;
    urlencoded = new URLSearchParams();
    //get input values
    for (var i = 3; i > 0; i--) {
     
      let name = document.getElementById(i).name;
      let value = document.getElementById(i).value;
      urlencoded.append(name,value);      
    }
let retrievedToken =  Cookies.get('lfjwt',);
if(retrievedToken){
urlencoded.append('token',retrievedToken);
}else{
      document.getElementById('message').innerHTML = 'you need to log in to claim item';
      document.getElementById('message').style.color = loginMessagesColor[2];

}
urlencoded.append('id',itemId);
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");


var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch(`${process.env.REACT_APP_backEndAPI_URL}/claimitem`, requestOptions)
  .then(response => response.json())
  .then(result => {
    
    if(result.id){
      document.getElementById('message').innerHTML = result['message'];
      document.getElementById('message').style.color = loginMessagesColor[`${result['id']}`];
     // setTimeout(()=>{window.location.replace('http://192.168.43.236:3000/')},5000);
    }else{
     
      document.getElementById('message').innerHTML = 'something went wrong';
      document.getElementById('message').style.color = loginMessagesColor[2];      

    }
  })
  .catch(error => {
    //do something
    return error;
  }); 
      }

const Iamtheowner =(props)=>{
  alert('Please note that you can only submit claim on this particular item once, and you need to log in.');
	 const classes = useStyles();
   
   let itemId,itemName,itemDescription;

   if(!props.location.state){
   
     window.location.replace('/');
    }else if(props.location.state){
    itemId = props.location.state.itemId;
    itemName = props.location.state.itemName;
    itemDescription = props.location.state.itemDescription;

 }
   

	return(
		<div className={classes.body}>
		
		<CssBaseline />
		<Typography/>
     
        <div className={classes.signContainer}>

        <form id={'form'}>
		<h2>Claim This Item</h2>
    <h3 id='message'></h3>
     <Card id={'item'} style={{
          maxWidth:'70%',
          margin:'auto',
          textAlign:'left',
          backgroundColor:'black',
          color:'yellow',
          marginBottom:'10px',}}>
      <CardContent >
        <Typography  color="textSecondary" style={{fontSize: 14,}} gutterBottom>
          
        </Typography>
        <Typography variant="h5" id='name' component="h2" style={{marginTop:'-5px'}}>
          {itemName}
        </Typography>
        
        <Typography variant="body2" id='description' component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          {itemDescription}
        </Typography>
        
       
      </CardContent>
    </Card>
		 <div >
    <label for="longDescription"><b>Describe the Item in Details</b></label>
    <textarea id='1' name='description' placeholder='describe to let the finder know you are the true owner' className={classes.signInput} required></textarea>

    <label for="locations"><b>Locations</b></label>
    <input type="text" placeholder="List all possible places you could have lost it" id={'2'} name="location" required className={classes.signInput}/>
    
    <label for="time"><b>When Last Did You See the Item?</b></label>
    <input type="text" placeholder="date and time" id={'3'} name="when" required className={classes.signInput}/>
    
    <button type="submit" onClick={(e)=>claim(e,itemId)} className={classes.signButton}>I am the Owner</button>
    
  </div>


  	</form>
        </div>
		</div>

		)
}

export default Iamtheowner