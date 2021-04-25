import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import Cookies from 'js-cookie';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FullWidthTabs from './tabs'



const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#635ee7',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

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
},
body:{
	//marginLeft:'30px',
	textAlign:'center',
	margin: 'auto',
  	width: '100%',

  	


},
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: '#2e1534',
  },

}));



const Homebody = () =>{
          
       const classes = useStyles();
  	   const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
                 
	return(
		<div  className={classes.body}>
		<CssBaseline />
		<Typography/>
    
    
    {<div id={'bodyDiv'} >
         
         
        
         <Grid container>
	        <Grid item xs={12}>
	         	<FullWidthTabs/>
	        </Grid>
	     </Grid>



<div className={classes.root}>
      
      
    </div>

      
          </div>}
          </div>
          )
}


export default Homebody