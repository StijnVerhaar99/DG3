import React from 'react';


const NewFriends = (props) => {
    return (
        <li onClick={props.clickAdd} key={props.id}>{props.friend}</li>
    );
  }

export default NewFriends;