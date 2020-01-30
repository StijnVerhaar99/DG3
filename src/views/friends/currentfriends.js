import React from 'react';


const CurrentFriends = (props) => {
    return (
        <li key={props.id}>{props.friend}</li>
    );
  }

export default CurrentFriends;