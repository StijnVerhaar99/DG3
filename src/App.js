import React from 'react';
import RegisterPage from './views/register';
import LoginPage from './views/login';
import UserPage from './views/user';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">

    <Route exact path='/' component={LoginPage}/>
    <Route exact path='/register' component={RegisterPage}/>
    <Route exact path='/user' component={UserPage}/>

    </div>
    
    
    
  );
}

export default App;
