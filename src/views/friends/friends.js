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
      friends: [],
      newFriends: []
    };
  }

  componentDidMount() {
    this.getUserFriends();
    this.setNewFriends();
    this.setCurrentFriends();
  }

  getUserFriends = () => {
    fetch('http://localhost:4000/getuserfriends')
    .then(response => response.json())
    .then(response => this.setState({ userFriendsString: response.userFriends}))
  }

  setCurrentFriends = () => {
    fetch(`http://localhost:4000/setcurrentfriends`)
  }

  getCurrentFriends = () => {
    fetch(`http://localhost:4000/getcurrentfriends`)
    .then(response => response.json())
    .then(response => this.setState({ friends: response.data}))
    
  }

  setNewFriends = () => {
    fetch(`http://localhost:4000/setnewfriends`)
    .then(response => response.json())
    .then(response => this.setState({ newFriends: response.data}))  
  }

  addFriend = (id) => {
    fetch(`http://localhost:4000/addfriend?id=${id}`)
    this.setNewFriends();
    this.setCurrentFriends();
    this.getCurrentFriends();
    window.location.href= '../user';
    }


  showCurrentFriends() {
    this.setState({showCurrentFriends: true, showNewFriends: false});
  }
  showNewFriends() {
    this.setState({showCurrentFriends: false, showNewFriends: true});
  }

  render() {
    let FriendsList = null;
    let NewFriendsList = null;

    if (this.state.friends.length === 0) {
      this.getCurrentFriends();
    }
     
    console.log('state friends' + this.state.friends)
    if(this.state.friends.length !== 1) {
      if(typeof this.state.friends[0] !== 'undefined') {
        
        FriendsList = this.state.friends.map((friend) => {
          console.log(friend[0].name)
           return <CurrentFriends key={friend[0].id} friend={friend[0].name}/>
        })
      }
  }



    NewFriendsList = this.state.newFriends.map((friend) => {
         return <NewFriends
            clickAdd={() => this.addFriend(friend.id)} 
            key={friend.id} 
            friend={friend.name}
          />
    })


    return (
      <div>
        <div onClick={this.showCurrentFriends.bind(this)}>Vrienden</div>
        <div onClick={this.showNewFriends.bind(this)}>Zoek vrienden</div>
        {this.state.showCurrentFriends && FriendsList}
        {this.state.showNewFriends && NewFriendsList}
      </div>
    );
  }
}

export default friends;