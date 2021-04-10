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

export default function ItemCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
  <div>
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          
        </Typography>
        <Typography variant="h5" component="h2" style={{marginTop:'-5px'}}>
          Name of Item
        </Typography>
        
        <Typography variant="body2" component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </Typography>
        <i style={{fontSize:'10px'}}>CLAIMED > DENIED > <a href='#'>SEE REASON</a></i>
      </CardContent>
    </Card>
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
         
        </Typography>
        <Typography variant="h5" component="h2" style={{marginTop:'-5px',}}>
          Name of Item
        </Typography>
        
        <Typography variant="body2" component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </Typography>
        <i style={{fontSize:'10px'}}>CLAIMED > DENIED > <a href='#'>SEE REASON</a></i>
      </CardContent>
    </Card>
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
         
        </Typography>
        <Typography variant="h5" component="h2" style={{marginTop:'-5px',}}>
          Name of Item
        </Typography>
        
        <Typography variant="body2" component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </Typography>
        <i style={{fontSize:'10px'}}>CLAIMED > DENIED > <a href='#'>SEE REASON</a></i>
      </CardContent>
    </Card>
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
         
        </Typography>
        <Typography variant="h5" component="h2" style={{marginTop:'-5px',}}>
          Name of Item
        </Typography>
        
        <Typography variant="body2" component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </Typography>
        <i style={{fontSize:'10px'}}>CLAIMED > DENIED > <a href='#'>SEE REASON</a></i>
      </CardContent>
    </Card>
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
         
        </Typography>
        <Typography variant="h5" component="h2" style={{marginTop:'-5px',}}>
          Name of Item
        </Typography>
        
        <Typography variant="body2" component="p" style={{color:'white',marginBottom:'15px',paddingBottom:'0px'}}>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </Typography>
        <i style={{fontSize:'10px'}}>CLAIMED > DENIED > <a href='#'>SEE REASON</a></i>
      </CardContent>
    </Card>
    </div>
  );
}
