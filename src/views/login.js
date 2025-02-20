import React, { Component } from 'react';

class login extends Component {
    render() {
        return (
            <div>
                <h1>Login</h1>
                <form action="http://localhost:4000/login" method="POST">
                    <div>
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required></input>
                    </div>
                    <div>
                        <label for="password">Wachtwoord</label>
                        <input type="password" id="password" name="password" required></input>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <a href="/register">Register</a>
            </div>
        );
    }
}

export default login;