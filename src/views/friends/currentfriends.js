import React from 'react';


const CurrentFriends = (props) => {
    return (
        <li onClick={props.clickDelete} key={props.id}>{props.friend} </li>
    );
  }

export default CurrentFriends;