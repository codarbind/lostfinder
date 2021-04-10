import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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


let lostItems;

fetch('http://192.168.43.236:4000/items/lost')
    .then(results=>results.json())
    .then(results=>{

   lostItems =   results.map(result=>{
    return (
    <Card style={{minWidth: 275,
          maxWidth:'70%',
          margin:'auto',
          textAlign:'left',
          backgroundColor:'black',
          color:'yellow',}}>
      <CardContent >
        <Typography  color="textSecondary" style={{fontSize: 14,}} gutterBottom>
          
        </Typography>
        <Typography variant="h5" component="h2" style={{marginTop:'-5px'}}>
          {result.name}
        </Typography>
        
        <Typography variant="body2" component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          {result.description}
        </Typography>
        <i style={{fontSize:'10px'}}>CLAIMED > DENIED > <a href='#'>SEE REASON</a></i>
      </CardContent>
    </Card>
    );
  }); 
  
    })
    .catch(e=>{
        console.log(e);
    });

export default function LostItemCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;


  return (
  <div>

  {lostItems}


  </div>
  );
}
