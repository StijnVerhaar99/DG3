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
    };
  }

  componentDidMount() {
    this.getUserFriends();
    //this.setFriendsArray();
  }

  getUserFriends = () => {
    fetch('http://localhost:4000/getuserfriends')
    .then(response => response.json())
    .then(response => this.setState({ userFriendsString: response.userFriends}))
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

    return (
      <div>
        <div onClick={this.showCurrentFriends.bind(this)}>Vrienden</div>
        <div onClick={this.showNewFriends.bind(this)}>Zoek vrienden</div>
        {this.state.showCurrentFriends && <CurrentFriends/>}
        {this.state.showNewFriends && <NewFriends friends={friendsArray}/>}
      </div>
    );
  }
}

export default friends;