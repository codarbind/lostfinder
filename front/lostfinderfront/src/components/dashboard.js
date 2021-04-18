import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';




const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth:'70%',
    margin:'auto',
    textAlign:'left',
    backgroundColor:'black',
    color:'yellow',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


let dashboardItems, claimsOnItems, dashboarditemsArray;
let positionOfClaim = 0;
let idClicked;

function itemClicked(e){
  
  let idClicked = e.target.id;
  
  var x = document.getElementsByClassName("claimDetails");
    var i;
    for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    }
 document.getElementById(idClicked+'-'+'span').style.display = 'block';  

}


export default function Dashboard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [idClicked, setIdClicked] = React.useState('null');

  function ClaimItemClicked(props){

  let theOwner;
  if(props.owner=='false'){
   theOwner = false;
  }else{
    theOwner = true;
  }

  return(
  <span style={{display:'none'}} className={'claimDetails'} id={props.id+'-'+'span'}>

  {(theOwner && (<h3 style={{color:'white'}}>Does this describe the item you are looking for very much?:</h3>)) || (!theOwner && (<h3 style={{color:'white'}}>Does this describes the item with you?:</h3>))}
  <p><span style={{color:'white'}}>description</span> :{props.claim.itemDescription}</p>

   </span>                       
  )
}

  let retrievedToken = Cookies.get('lfjwt');
  if(!retrievedToken){window.location.replace('/')};

  let heading = (<Card style={{minWidth: 275,
          maxWidth:'70%',
          margin:'auto',
          textAlign:'left',
          backgroundColor:'black',
          color:'yellow',
          marginBottom:'10px',}}>
      <CardContent >
        <Typography  color="textSecondary" style={{fontSize: 14,}} gutterBottom>
          
        </Typography>
        <Typography variant="h5" component="h2" style={{marginTop:'-5px'}}>
          <p>welcome to your</p>
          <h2>DASHBOARD</h2>
        </Typography>
       
      </CardContent>

    </Card>);


  let urlencoded = new URLSearchParams();
      var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
urlencoded.append('token',retrievedToken);
var requestOptions = {
  method: 'get',
  headers: myHeaders,
};
    
  fetch(`${process.env.REACT_APP_backEndAPI_URL}/dashboarditems/${retrievedToken}`,requestOptions)
    .then(results=>results.json())
    .then(results=>{
      console.log(results);
      if(results.status == '2') {
        dashboardItems = (<p style={{color:'red'}}>{results.message}</p>);
      }else{

    
   dashboardItems =   results.dashboarditems.map(result=>{

    if(result.claims){

      dashboarditemsArray = Object.entries(result.claims); //turn the Object to array of arrays

      claimsOnItems = dashboarditemsArray.map(elementsOfDashboardItemsArray=>{
    
      positionOfClaim = dashboarditemsArray.indexOf(elementsOfDashboardItemsArray);

      return(

<span>
      <span 
           style={{
        backgroundColor: `black`,
        color: `yellow`,
        border: `2px solid yellow`,
        borderRadius:'50%',
        cursor:'pointer',     
        display: 'inline-flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft:'5px',

      }}

      id = {result._id+'-'+positionOfClaim }
        onClick={(e)=>itemClicked(e)}>{positionOfClaim + 1}</span>
       <ClaimItemClicked id={result._id+'-'+positionOfClaim} claim={result.claims[Object.keys(result.claims)[positionOfClaim]]} owner={result.type.slice(result.type.lastIndexOf('-')+1)} />
        </span>

      );

    });
  }else{
    claimsOnItems = (<span>nil</span>);
  }
    
    
    return (
    <Card style={{minWidth: 275,
          maxWidth:'70%',
          margin:'auto',
          textAlign:'left',
          backgroundColor:'black',
          color:'yellow',
          marginBottom:'10px',}}>
      <CardContent >
        <Typography  color="textSecondary" style={{fontSize: 14,}} gutterBottom>
          
        </Typography>
        <span style={{float:'right'}}><i>{result.type}</i></span>
        <Typography variant="h5" component="h2" style={{marginTop:'-5px'}}>
          {result.name}
        </Typography>
        
        <Typography variant="body2" component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          {result.description}
        </Typography>

        <div
      style={{
        backgroundColor: `black`,
        color: `yellow`,
        border: `2px solid yellow`,
        borderRadius:'5px',
        padding: '5px 5px',
        marginBottom:'-10px',
        display: 'inline-flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}

      id={result._id}
        >
        <span>CLAIMS: 
         
        {claimsOnItems}

        </span>

        </div>
       
      </CardContent>

    </Card>
    );
  }); 
setIsLoaded(true);
  }
    })
    .catch(e=>{
        console.log(e);
    });



  return (
  <div>

  {heading}
  {(isLoaded && (dashboardItems))||(!isLoaded && (<CircularProgress id={'loader'} size={100} thickness={20} style={{color:'black'}}/>))}


  </div>
  );
}
