import React, { Component } from 'react';

class register extends Component {
    
    render() {

    function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] === variable){return pair[1];}
            }
       return(false);
    }

    let error = getQueryVariable('err');
    let message = null;

    if(error === "0") {
        message = "Account is aangemaakt";
    } else if(error === "1") {
        message = 'Wachtwoorden zijn niet hetzelfde';
    } else if(error === "2") {
        message = "Email is al in gebruik";
    } else {
        message = null;
    }


        return (
            <div>
                <h1>Register</h1>
                <p>{message}</p>
                <form action="http://localhost:4000/register" method="POST">
                    <div>
                        <label for="name">Naam</label>
                        <input type="text" id="name" name="name" required></input>
                    </div>
                    <div>
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required></input>
                    </div>
                    <div>
                        <label for="password">Wachtwoord</label>
                        <input type="password" id="password" name="password1" required></input>
                    </div>
                    <div>
                        <label for="password">Wachtwoord herhalen</label>
                        <input type="password" id="password" name="password2" required></input>
                    </div>
                    <button type="submit">Register</button>
                </form>
                <a href="/">Login</a>
            </div>
        );
    }
}

export default register;