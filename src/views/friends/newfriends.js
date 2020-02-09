import React from 'react';


const NewFriends = (props) => {
    return (
      <div className='wrapper'>
        <div className='friends-name'key={props.id}>{props.friend}</div>
        <button className='friends-button small-button' onClick={props.clickAdd}>Voeg toe</button>
      </div>

    );
  }

export default NewFriends;