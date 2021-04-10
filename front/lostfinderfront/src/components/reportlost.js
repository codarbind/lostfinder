import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Cookies from 'js-cookie';
import {ReportItem }from './reportfound'

let messageColor ={
  '1':'green',
  '2':'red',
  '3':'red',
}


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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

}));

export default function ReportLost() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h3 id="simple-modal-title">REPORT AN ITEM YOU'RE LOOKING FOR</h3>
      <p>Sorry about your lost item, kindly provide the details of the item, let us find it for you.</p>
      <form id={'form'}>
     <div >
    <label for="itemName"><b>Name of Item</b></label>
    <input type="text" placeholder="what is the name of the item?" id={'1'} name="itemName" required className={classes.signInput}/>
    
    <label for="shortD"><b>Short Description</b><i style={{fontSize:'12px'}}>: other users can see this description</i></label>
    <input type="text" placeholder="describe the item to help others identify it" id={'2'} name="shortD" required className={classes.signInput}/>
    
    <label for="location"><b>Location</b></label>
    <input type="text" placeholder="list all the possible places you could have lost it" id={'3'} name="location" required className={classes.signInput}/>
    
    <label for="date"><b>When last did you see the item?</b></label>
    <input type="date" placeholder="when could you have lost this item?" id={'4'} name="date" required className={classes.signInput}/>
    
    <input type="text" id={'5'} name="type" required value='lost' hidden/>

    <button type="submit" className={classes.signButton} onClick={ReportItem}>HELP FIND</button>
    </div>
    </form> 
    <p id={'0'} ></p>     
    </div>
  );

  return (
    <div>
    <div style={{width:'40%',margin:'auto'}}>
      <button className={classes.signButton} type="button" onClick={handleOpen}>
          REPORT LOST ITEM
      </button>
    </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
