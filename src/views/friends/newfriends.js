import React, { Component } from 'react';


class newfriends extends Component {

  state = {
    user: []
  }

  componentDidMount() {
    this.getNewFriends();
    console.log(this.state.user);
  }

  getNewFriends = _ => {
      fetch('http://localhost:4000/getnewfriends')
      .then(response => response.json())
      .then(response => this.setState({ user: response.data}))

      // fetch('http://localhost:4000/getuserdata')
      // .then(response => response.json())
      // .then(response => this.setState({ user: response.userData}))
  }

  render() {
    return (
      <div>
        nieuwe vrienden
      </div>
    );
  }
}

export default newfriends;