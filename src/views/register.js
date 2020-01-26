import React, { Component } from 'react';

class register extends Component {
    render() {
        return (
            <div>
                <h1>Register</h1>
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