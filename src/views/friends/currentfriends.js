import React from 'react';


const CurrentFriends = (props) => {
    return (
      <div className='wrapper'> 
        <div className='friends-name' onClick={props.goToUser} key={props.id}>{props.friend} </div> 
        <button className='friends-button small-button' onClick={props.clickDelete}>Verwijder</button> 
      </div>
    );
  }

export default CurrentFriends;