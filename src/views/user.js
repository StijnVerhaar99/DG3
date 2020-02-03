import React, { Component } from 'react';

import Friends from './friends/friends';
import Pictures from './pictures';
import Messages from './messages';

class user extends Component {

    state = {
        user: []
    }

    componentDidMount() {
        this.getUserData();
        this.getThisUser();
    }

    getUserData = () => {
        fetch('http://localhost:4000/getuserdata')
        .then(response => response.json())
        .then(response => this.setState({ user: response.userData}))
    }

    getThisUser() {
        var urlParams = new URLSearchParams(window.location.search);

        let thisUser = (urlParams.get('user')); 
        this.setState({ thisUser : thisUser })
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

        //console.log('this user ' + this.state.thisUser);

        return (
            <div>
                <form action="http://localhost:4000/logout" method="POST">
                    <button type="submit">Log uit</button>
                </form>
                <h1>Hallo {userName} {userEmail}</h1>
                <Friends/>
                <Pictures/>
                <Messages thisUser={this.state.thisUser}/>


            </div>
        );
    }
}

export default user;