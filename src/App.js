import React from 'react';
import RegisterPage from './views/register';
import LoginPage from './views/login';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">

    <Route exact path='/' component={LoginPage}/>
    <Route exact path='/register' component={RegisterPage}/>

    </div>
    
    
    
  );
}

export default App;
