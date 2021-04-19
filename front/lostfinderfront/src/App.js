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
import Iamtheowner from './components/iamtheowner';
import IfoundThis from './components/ifoundthis';
import Dashboard from './components/dashboard';




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

fetch(`${process.env.REACT_APP_backEndAPI_URL}/confirmtoken`, requestOptions)
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
          {<h1 id={'greet'} style={{marginTop:'90px',marginLeft:'15%'}}>Hello,</h1>}
        </Grid>
        </Grid>
        <Route exact path='/' component={Homebody} />
      </div>}
            
      <Route path='/login' component={Login} />
      <Route path='/signup' component={SignUp} />
      <Route path='/pass' component={Pass} />
      <Route path='/resetpassword' component={Resetpassword} />
      <Route path='/claimitem' component={Iamtheowner}/>
      <Route path='/returnitem' component={IfoundThis}/>
      <Route path='/dashboard' component={Dashboard}/>
        </BrowserRouter>
      
      
      
      
      </div>
      
    );}
}

export default App;
