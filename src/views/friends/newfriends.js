import React, { Component } from 'react';


class NewFriends extends Component {
   constructor(props) {
    super(props);

    this.state = {
      friends: []
    };
  }

  componentDidMount() {
    this.getNewFriends();
  }

  getNewFriends = () => {
      fetch('http://localhost:4000/getnewfriends')
      .then(response => response.json())
      .then(response => this.setState({ friends: response.data}))
  }

  render() {

    // let newFriendsList = this.state.friends.map((friend) => {
    //   return <li key={friend.id}>{friend.name}</li>
    // })

    //console.log(newFriendsList)
    return (

      <div >
        nieuwe vrienden
        <ul>
          {/* {newFriendsList} */}
        </ul>
      </div>
    );
  }
}

export default NewFriends;