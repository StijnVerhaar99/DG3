import React, { Component } from 'react';

class user extends Component {

    state = {
        user: [] 
    }

    componentDidMount() {
        this.getUserData();
    }

    getUserData = () => {
        fetch('http://localhost:4000/getuserdata')
        .then(response => response.json())
        .then(response => this.setState({ user: response.userData}))
    }

    render() {

        let userName = null;
        let userEmail = null;

        this.state.user.map((user) => {
            return (
                userName = user.name,
                userEmail = user.email
            )
            
        })
        console.log(userEmail);

        return (
            <div>
                <h1>Hallo {userName}</h1>
            </div>
        );
    }
}

export default user;