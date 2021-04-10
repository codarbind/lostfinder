//import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Login from './components/login'
import SignUp from './components/signup'
import Homebody from './components/homebody'
import Pass from './components/pass'
import Resetpassword from './components/resetpassword'
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';




class App extends Component {

       constructor(props){
          super(props);
            this.state ={
  headerProps:{auth:false},
  isLoaded: false,
  componentState:{},
}
}



componentDidMount(){
        let retrievedToken = Cookies.get('lfjwt');
let urlencoded = new URLSearchParams();
            var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
urlencoded.append('token',retrievedToken);
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("http://192.168.43.236:4000/confirmtoken", requestOptions)
  .then(response => response.json())
  .then(result => {
    let {userEmail, firstName} = result.verifiedJwt;
    console.log('verifiedJwt',result.verifiedJwt);
    
    this.setState({
      headerProps:{auth:result.auth},
      isLoaded:true,
      componentState:{
        userEmail,
        firstName
      },
    });
    let states =this.state.componentState;
    document.getElementById('greet').innerHTML = `Hi ${states.firstName},`;
  })
  .catch(error => {return error}); 
      }
  render(){
   

    return (

      
      <div className="App" style={{background:'yellow'}}>

      <BrowserRouter>
      {(<Header headerProps={this.state.headerProps} />)}
      {<div style={{marginLeft:'30px',marginRight:'30px', textAlign:'left'}}>
           <Grid container spacing={3}>
        <Grid item xs={12}>
          {<h1 id={'greet'} style={{marginTop:'90px'}}>Hello,</h1>}
        </Grid>
        </Grid>
        <Route exact path='/' component={Homebody} />
      </div>}
            
      <Route path='/login' component={Login} />
      <Route path='/signup' component={SignUp} />
      <Route path='/pass' component={Pass} />
      <Route path='/resetpassword' component={Resetpassword} />
        </BrowserRouter>
      
      
      </div>
      
    );}
}

export default App;
