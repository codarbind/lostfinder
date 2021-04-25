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


export default function Dashboard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const [isLoaded,setIsLoaded] = React.useState(false);
  const [idClicked, setIdClicked] = React.useState('null');
  var decision;

 function decide(e){

    let idOfItemToDecideOn = e.slice(0,e.lastIndexOf('-') -2 );
    let decisionOnItem = e.slice(e.lastIndexOf('-') + 1 );
    let status;
    if(decisionOnItem == 'accepted'){status = 'settled'}else{status = 'unSettled'}
    let positionOfToDecideOn = e.slice(e.lastIndexOf('-')-1,e.lastIndexOf('-') );
    let retrievedToken = Cookies.get('lfjwt');
    if(decisionOnItem =='rejected'){
     var proceed =  window.confirm(`CONTINUE with REJECT?\n\nThis cannot be undone if completed.`)
    }else{
      var proceed =  window.confirm(`PROCEED with ACCEPT?\n\nThis cannot be undone if completed, and you'll not have access to other claims on this particular item.`);
    }

    if (!proceed ){return  alert('aborted')}
    let urlencoded = new URLSearchParams();
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    urlencoded.append('token',retrievedToken);
    urlencoded.append('decision',decisionOnItem);
    urlencoded.append('_id',idOfItemToDecideOn);
    urlencoded.append('position',positionOfToDecideOn);
    urlencoded.append('status',status);
    let requestOptions = {
    method: 'post',
    headers: myHeaders,
    body: urlencoded,
};
    
  fetch(`${process.env.REACT_APP_backEndAPI_URL}/decideonitem`,requestOptions)
    .then(results=>results.json()) 
    .then(results=>{
      alert(results.message);
      console.log('deci',results,results.message);
      window.location.reload();
    })
  }
 
 

  function ClaimItemClicked(props){

  let headingIfOwnerTrue = (props.details.owner && (<h3 style={{color:'white'}}>Does this describe the item you are looking for, very much?:</h3>)) || (!props.details.owner && (<h3 style={{color:'white'}}>Does this describes the item with you?:</h3>))
  let headingIfOwnerFalse = (props.details.owner && (<h3 style={{color:'white'}}>How you described this item you lost:</h3>)) || (!props.details.owner && (<h3 style={{color:'white'}}>How you described this item you found:</h3>))
  let decisionButtonsForReporters =(<div><Button style={{color:'red'}} id={props.id+"-"+"rejected"} onClick={()=>decide(`${props.id}-rejected`)}>REJECT</Button><Button style={{color:'green'}} id={props.id+"-"+"accepted"} onClick={()=>decide(props.id+"-"+"accepted")}>ACCEPT</Button><hr/></div>);
  
  let responseIfDecisionAcceptedForOwnerReporter = (props.details.owner && (props.details.reporter) && (props.status == 'settled') && (<span><hr /><span>UPDATE</span><h3 style={{ color: 'white' }}>Congrats. You can contact the finder of your item:{props.owner}</h3></span>));
  let responseIfDecisionAcceptedForNotOwnerNotReporter = (!props.details.owner && !(props.details.reporter) && (props.status == 'settled') && (<span><hr /><h3 style={{ color: 'white' }}>Superb!! The owner of the item shall get in touch with you via: {props.reporterOfItem}</h3></span>));
  let responseIfDecisionAcceptedForOwnerNotReporter = (props.details.owner && !(props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Cheers on finding your item. Contact the finder of your item on:{props.owner}</h3></span>) );
  let responseIfDecisionAcceptedForNotOwnerReporter = (!props.details.owner && (props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>We are grateful. The owner of the item shall get in touch with you. You call also reach them via: {props.reporterOfItem}</h3></span>) );

  let responseIfDecisionRejectedForNotOwnerReporter = (!props.details.owner && (props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Great, we shall let this user know that the item with you is not theirs. Thank you for your help.</h3></span>) );
  let responseIfDecisionRejectedForNotOwnerNotReporter = (!props.details.owner && !(props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Marvelous!! We shall let this user know that the item is not yours. Best of luck in finding yours.</h3></span>) );
  let responseIfDecisionRejectedForOwnerReporter = (props.details.owner && (props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Awesome Still!! We shall let the finder of this item know that it is not yours. Best of luck in finding yours.</h3></span>) );
  let responseIfDecisionRejectedForOwnerNotReporter = (props.details.owner && !(props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Hmmm, the finder thinks the item is not yours. We will keep looking out for yours.</h3></span>) );
  
  let responseIfDecisionRejectedIndirectForNotOwnerReporter = (!props.details.owner && (props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>The user did not accept this item with you as not theirs. Kindly report this item found to enable rightful owner find it. Thank you for your help.</h3></span>) );
  let responseIfDecisionRejectedIndirectForNotOwnerNotReporter = (!props.details.owner && !(props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Nothing spoil!! The owner of the report has found their true item. Please report this item you found to enable the owner find it. We appreciate your support.</h3></span>) );
  let responseIfDecisionRejectedIndirectForOwnerReporter = (props.details.owner && (props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Wow!! We shall let the finder of this item know that it is not yours. We are happy you have found yours.</h3></span>) );
  let responseIfDecisionRejectedIndirectForOwnerNotReporter = (props.details.owner && !(props.details.reporter ) && (props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Ermmm, it seems your description did not match the item, as the item has been returned to someone else. Kindly report your item missing. Let's find it.</h3></span>) );

  let responseIfDecisionRejectedForNotOwnerReporterUnsettled = (!props.details.owner && (props.details.reporter ) && !(props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Respect!! They do not think the item is theirs. Please try and report it on this platform. Let us find the owner together, cheers!</h3></span>) );
  let responseIfDecisionRejectedForNotOwnerNotReporterUnsettled = (!props.details.owner && !(props.details.reporter ) && !(props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>We are grateful!! However, the other user do not think the item with you is theirs. Kindly report this item found, let us find the rightful owner.</h3></span>) );
  let responseIfDecisionRejectedForOwnerReporterUnsettled = (props.details.owner && (props.details.reporter ) && !(props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Lets keep looking... We have updated the other user that that is not your item.</h3></span>) );
  let responseIfDecisionRejectedForOwnerNotReporterUnsettled = (props.details.owner && !(props.details.reporter ) && !(props.status == 'settled') && (<span><hr/><h3 style={{color:'white'}}>Hmmm, the finder thinks the item is not yours. We will keep looking out for yours.</h3></span>) );
  


  console.log('stat',props.claim.status);


  return(
  <span style={{display:'none'}} className={'claimDetails'} id={props.id+'-'+'span'}>

  {props.details.reporter && (headingIfOwnerTrue) || !props.details.reporter && (headingIfOwnerFalse)}
  
  {(props.details.reporter && (<p><span style={{color:'white'}}>their description</span>:<br/>{props.claim.itemDescription}</p>))||(!props.details.reporter && (<p><span style={{color:'white'}}>your description</span>:<br/>{props.claim.itemDescription}</p>))}
  
  {!(props.claim.status == 'rejected')  && (props.details.reporter && !(props.status == 'settled') && (decisionButtonsForReporters))}
  {!(props.claim.status == 'rejected') && (!props.details.reporter && !(props.status == 'settled') &&  (<span style={{color:'blue'}}><i>awaiting response</i></span>))}

  {(props.claim.status == 'rejected') && props.details.owner  && (props.details.reporter && !(props.status == 'settled') && (responseIfDecisionRejectedForOwnerReporterUnsettled))}
  {(props.claim.status == 'rejected') && props.details.owner && (!props.details.reporter && !(props.status == 'settled') &&  (responseIfDecisionRejectedForOwnerNotReporterUnsettled))}
  {(props.claim.status == 'rejected') && !props.details.owner  && (props.details.reporter && !(props.status == 'settled') && (responseIfDecisionRejectedForNotOwnerReporterUnsettled))}
  {(props.claim.status == 'rejected') && !props.details.owner && (!props.details.reporter && !(props.status == 'settled') &&  (responseIfDecisionRejectedForNotOwnerNotReporterUnsettled))}

  
  { (props.claim.status == 'accepted') && (responseIfDecisionAcceptedForOwnerReporter)}
  { (props.claim.status == 'accepted') && (responseIfDecisionAcceptedForNotOwnerNotReporter)}
  { (props.claim.status == 'accepted') && (responseIfDecisionAcceptedForOwnerNotReporter)}
  { (props.claim.status == 'accepted') && (responseIfDecisionAcceptedForNotOwnerReporter)}

  { (props.claim.status == 'rejected') && (responseIfDecisionRejectedForNotOwnerReporter)}
  { (props.claim.status == 'rejected') && (responseIfDecisionRejectedForNotOwnerNotReporter)}
  { (props.claim.status == 'rejected') && (responseIfDecisionRejectedForOwnerReporter)}
  { (props.claim.status == 'rejected') && (responseIfDecisionRejectedForOwnerNotReporter)}

  { (props.claim.status == undefined) && (responseIfDecisionRejectedIndirectForNotOwnerReporter)}
  { (props.claim.status == undefined) && (responseIfDecisionRejectedIndirectForNotOwnerNotReporter)}
  { (props.claim.status == undefined) && (responseIfDecisionRejectedIndirectForOwnerReporter)}
  { (props.claim.status == undefined) && (responseIfDecisionRejectedIndirectForOwnerNotReporter)}

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
        
      if(results.status == '2') {
        dashboardItems = (<p style={{color:'red'}}>{results.message}</p>);
      }else{

console.log('jt',results);
   dashboardItems =   results.dashboarditems.map(result=>{
       console.log('pok', result);
       
    if(!result.status){result.status = 'false'; console.log('uhj',result)}
       if (result.claims) {

      dashboarditemsArray = Object.entries(result.claims); //turn the Object to array of arrays

        claimsOnItems = dashboarditemsArray.map(elementsOfDashboardItemsArray => {
    
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
              <ClaimItemClicked id={result._id + '-' + positionOfClaim} reporterOfItem={result.reporter} owner={Object.keys(result.claims)[positionOfClaim].replace(/[*]/g, ".")} claim={result.claims[Object.keys(result.claims)[positionOfClaim]]} details={result.type} status={result.status}  />
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
        <span style={{float:'right'}}><i>{result.type.type}</i></span>
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
