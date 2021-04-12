import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth:'70%',
    margin:'auto',
    textAlign:'left',
    backgroundColor:'black',
    color:'yellow',
    marginBottom:'10px',
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


let foundItems;

fetch(`${process.env.REACT_APP_backEndAPI_URL}/items/found`)
    .then(results=>results.json())
    .then(results=>{

   foundItems =   results.map(result=>{
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
        <Typography variant="h5" component="h2" style={{marginTop:'-5px'}}>
          {result.name}
        </Typography>
        
        <Typography variant="body2" component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          {result.description}
        </Typography>
        <Button style={{
  backgroundColor: `black`,
  color: `yellow`,
  padding: `14px 20px`,
  margin: `8px 0`,
  border: `2px solid yellow`,
  cursor: `pointer`,
  width: `100%`,
}} id={result._id} component={Link} to={{state:{name:result.name,description:result.description},pathname:`/claimitem/${result._id}`}}>THIS IS MY ITEM</Button>
       
      </CardContent>
    </Card>
    );
  }); 
  
    })
    .catch(e=>{
        console.log(e);
    });

export default function FoundItemCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;


  return (
  <div>

  {foundItems}


  </div>
  );
}
