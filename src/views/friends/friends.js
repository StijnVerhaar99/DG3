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
    fetch(`http://localhost:4000/setcurrentfriends?user=${this.getThisUser()}`)
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
    window.location.href= `../user?user=${this.getThisUser()}`;
  }

  deleteFriend(id) {
    fetch(`http://localhost:4000/deletefriend?id=${id}`)
    this.setNewFriends();
    this.setCurrentFriends();
    this.getCurrentFriends();
    window.location.href= `../user?user=${this.getThisUser()}`;
  }

  getThisUser() {
    var urlParams = new URLSearchParams(window.location.search);
    let thisUser = (urlParams.get('user')); 
    return thisUser;
}

  goToUser(id) {
    window.location.replace(`http://localhost:3000/user?user=${id}`)
  }


  showCurrentFriends() {
    this.setState({showCurrentFriends: true, showNewFriends: false});
  }
  showNewFriends() {
    this.setState({showCurrentFriends: false, showNewFriends: true});
  }

  getThisUser() {
    var urlParams = new URLSearchParams(window.location.search);
    let thisUser = (urlParams.get('user')); 
    return thisUser;
  }

  render() {
    let FriendsList = null;
    let NewFriendsList = null;

    if (this.state.friends.length === 0) {
      this.getCurrentFriends();
    }
    
    if(this.state.userFriendsString !== '') {
      if(this.state.friends.length >= 1) {
        if(typeof this.state.friends[0] !== 'undefined') {
          FriendsList = this.state.friends.map((friend) => {
             return <CurrentFriends 
             clickDelete={() => this.deleteFriend(friend[0].id)}
             goToUser={() => this.goToUser(friend[0].id)}
             key={friend[0].id} 
             friend={friend[0].name}
             />
          })
        }
      }
    }

    NewFriendsList = this.state.newFriends.map((friend) => {
      return <NewFriends
          clickAdd={() => this.addFriend(friend.id)} 
          key={friend.id} 
          friend={friend.name}
        />
    })

    let searchButton = null;

    if(this.props.sameUser) {
      searchButton = <p className='friends-button-right' onClick={this.showNewFriends.bind(this)}>Zoek vrienden</p>
    }



    return (
      <div className='component'>
        <div className='wrapper'>
          <p className='friends-button-left' onClick={this.showCurrentFriends.bind(this)}>Vrienden</p>
          {searchButton}
        </div>

        {this.state.showCurrentFriends && FriendsList}
        {this.state.showNewFriends && NewFriendsList}
      </div>
    );
  }
}

export default friends;