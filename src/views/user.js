import React, { Component } from 'react';

class user extends Component {

    state = {
        user: [] 
    }

    getUserEmail = () => {
        fetch('http://localhost:4000/getuseremail')
        .then(response => response.json())
        .then(response => this.setState({ user: response.email}))
    }

    render() {
        this.getUserEmail();


        return (
            <div>
                <h1>{this.state.user}</h1>
            </div>
        );
    }
}

export default user;