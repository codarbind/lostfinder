import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Menu';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import HomeIcon from '@material-ui/icons/Home';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import NotificationsSharpIcon from '@material-ui/icons/NotificationsSharp';
import GavelSharpIcon from '@material-ui/icons/GavelSharp';
import QuestionAnswerSharpIcon from '@material-ui/icons/QuestionAnswerSharp';
import ReportProblemSharpIcon from '@material-ui/icons/ReportProblemSharp';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: "black",

  },
  list: {
    width: 250,
  },
  fullList: {
    width: 250,
    height: 'auto',
  },
  title: {
    flexGrow: 1,
    fontFamily: "Righteous, cursive",
    fontWeight: 500,
    color: "black",
    textAlign: "left",
    fontSize:"40px",
    textDecoration:'none',
  },
  header: {
      backgroundColor: "#FFFF00",
      color: 'black',
      position:'fixed',
      top:0,


    },

    paper: {
    background: "black",
    color:"yellow",
    
  },

  yellowFont:{
    color:'yellow',
  },
  blackFont:{
    color: 'black'
  },

  yellowOnBlack:{
    backgroundColor:'black',
    color:'yellow'
  },
  blackOnYellow:{
    backgroundColor:'yellow',
    color:'black',
  },
  menuClass:{
    marginTop:'46px',
  }

    
}));



export default  function Header(props) {

  let {headerProps} = props;
  const classes = useStyles();

   const [state, setState] = React.useState({
    left: false,
    items:[],
    isLoaded:false,
    
  });


    const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


   const list = (anchor) => (
    <div
      className={clsx(classes.list,  {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
          <ListItem button key={'Home'}>
            <ListItemIcon className={classes.yellowFont}>{<HomeIcon />}</ListItemIcon>
              <ListItemText primary={'Home'} />
          </ListItem>
          <ListItem button key={'Notifications'}>
            <ListItemIcon className={classes.yellowFont}>{<NotificationsSharpIcon />}</ListItemIcon>
              <ListItemText primary={'Notifications'} />
          </ListItem>
          <ListItem button key={'FAQ'}>
            <ListItemIcon className={classes.yellowFont}>{<ContactSupportIcon />}</ListItemIcon>
              <ListItemText primary={'FAQ'} />
          </ListItem>
          <ListItem button key={'Report an Issue'}>
            <ListItemIcon className={classes.yellowFont}>{<ReportProblemSharpIcon />}</ListItemIcon>
              <ListItemText primary={'Report an Issue'} />
          </ListItem>
          <ListItem button key={'Terms and Conditions'}>
            <ListItemIcon className={classes.yellowFont}>{<GavelSharpIcon />}</ListItemIcon>
              <ListItemText primary={'Terms and Conditions'} />
          </ListItem>
          <ListItem button key={'Contact Us'}>
            <ListItemIcon className={classes.yellowFont}>{<QuestionAnswerSharpIcon />}</ListItemIcon>
              <ListItemText primary={'Contact Us'} />
          </ListItem>
          

      </List>
    </div>
  );

  let auth = headerProps.auth;

  //const [auth, setAuth] = React.useState(headerProps.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  /*const handleChange = (event) => {
    setAuth(event.target.checked);
  };*/ 

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
   let option = e.target.id;
   if(option === 'signoutButton'){
    Cookies.remove('lfjwt');
    window.location.reload();
   }
  };

  const preventD =(e) =>{
    e.preventDefault();
}


  return (

 
    <header>
      <AppBar position="static" className={classes.header}>
        <Toolbar>
          <IconButton edge="start"  className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer('left', true)} >
            <MenuIcon />
            
          </IconButton>
           <Drawer anchor='left' open={state['left']} onClose={toggleDrawer('left', false)} classes={{ paper: classes.paper, }}>
            {list('left')}
          </Drawer> 
          <Typography variant="h6" className={classes.title} component={Link} to='/'>
            Lostfinders
          </Typography>
          {auth && (

            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem id={'dashboardButton'} component={Link} to='/dashboard' onClick={handleClose} >Dashboard</MenuItem>
                <MenuItem id={'signoutButton'} onClick={handleClose}>Sign Out</MenuItem>
              </Menu>
            </div>
          )}
          {!auth && (
            <Button component={Link} className={classes.yellowOnBlack} variant="contained" to="/login">
              Log In
              
              </Button>
            )}

        </Toolbar>
      </AppBar>
   
    </header>
  );
}
