import React, { Component } from 'react';
import NewFriends from './newfriends';
import CurrentFriends from './currentfriends';


class friends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userFriendsString: '',
      userFriendsArray: [],
      showCurrentFriends: true,
      showNewFriends: false,
      friends: []
    };
  }

  componentDidMount() {
    this.getUserFriends();
    //if (typeof this.state.friends === []) {
      this.getNewFriends();
      this.setNewFriends();
    //}
    console.log(friends);
    //console.log(typeof this.state.friends !== [])
  }

  getUserFriends = () => {
    fetch('http://localhost:4000/getuserfriends')
    .then(response => response.json())
    .then(response => this.setState({ userFriendsString: response.userFriends}))
  }

  getNewFriends = () => {
    fetch('http://localhost:4000/setnewfriends')
  }

  setNewFriends = () => {
    fetch('http://localhost:4000/getnewfriends')
    .then(response => response.json())
    .then(response => this.setState({ friends: response.data}))
  }





  setFriendsArray = (friends) => {
    let arrayFriends = friends.split(',');
    return arrayFriends;
  }

  showCurrentFriends() {
    this.setState({showCurrentFriends: true, showNewFriends: false});
  }
  showNewFriends() {
    this.setState({showCurrentFriends: false, showNewFriends: true});
  }

  render() {
    const friendsString = this.state.userFriendsString;

    const friendsArray = this.setFriendsArray(friendsString);

    //console.log(this.state.friends);

      let newFriendsList = this.state.friends.map((friend) => {
         return <li key={friend.id}>{friend.name}</li>
       })

    return (
      <div>
        <div onClick={this.showCurrentFriends.bind(this)}>Vrienden</div>
        <div onClick={this.showNewFriends.bind(this)}>Zoek vrienden</div>
        {this.state.showCurrentFriends && <CurrentFriends/>}
        {this.state.showNewFriends && <NewFriends friends={friendsArray}/>}
        {newFriendsList}
      </div>
    );
  }
}

export default friends;