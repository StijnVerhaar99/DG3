import React, { Component } from 'react';

class messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    componentDidMount() {
        this.getMessages();
    }

    getMessages() {
        //console.log('thisID' + this.props.thisId)
        fetch(`http://localhost:4000/getmessages?user=${this.getThisUser()}`)
        .then(response => response.json())
        .then(response => this.setState({ messages: response.data }))
    }

    getThisUser() {
        var urlParams = new URLSearchParams(window.location.search);
        let thisUser = (urlParams.get('user')); 
        return thisUser;
    }

    render() {
        return (
            <div className='component'>
                <h1 className='message-title'>Berichten</h1>
                <div className='message-list'>
                    {this.state.messages.map((message) => {
                       return(
                        <div>
                            <br></br>
                            <div>{message.message}</div>
                        </div>
                       )
                    })}
                </div>
                <form className='message-form' action={`http://localhost:4000/placemessage?thisUserID=${this.getThisUser()}`} method="POST">
                    <textarea className='message-form-text' name="message" rows="4" cols="50"></textarea>
                    <button className='message-form-button' type="submit">Plaats bericht</button>
                </form>

                
            </div>
        );
    }
}

export default messages;