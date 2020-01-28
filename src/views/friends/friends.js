import React, { Component } from 'react';
import NewFriends from './newfriends';
import CurrentFriends from './currentfriends';


class friends extends Component {
  state = {
    showCurrentFriends: true,
    showNewFriends: false,
  }

  showCurrentFriends() {
    this.setState({showCurrentFriends: true, showNewFriends: false});
  }

  showNewFriends() {
    this.setState({showCurrentFriends: false, showNewFriends: true});
  }
  render() {



    return (
      <div>
        <div onClick={this.showCurrentFriends.bind(this)}>Vrienden</div>
        <div onClick={this.showNewFriends.bind(this)}>Zoek vrienden</div>
        {this.state.showCurrentFriends && <CurrentFriends/>}
        {this.state.showNewFriends && <NewFriends/>}
      </div>
    );
  }
}

export default friends;