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


export default function Dashboard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const [isLoaded,setIsLoaded] = React.useState(false);

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
          <h1>DASHBOARD</h1>
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

      dashboarditemsArray = Object.entries(result.claims);

      claimsOnItems = dashboarditemsArray.map(elementsOfDashboardItemsArray=>{
    
      positionOfClaim = dashboarditemsArray.indexOf(elementsOfDashboardItemsArray);

      return(

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
        >{positionOfClaim + 1}</span>

      );

    });
  }else{
    claimsOnItems = (<span>NiL</span>);
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
