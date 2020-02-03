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
        fetch('http://localhost:4000/getmessages')
        .then(response => response.json())
        .then(response => this.setState({ messages: response.data }))
    }

    render() {
        let thisUser = this.props.thisUser;
        return (
            <div>
                <h1>Berichten</h1>
                <div>
                    {this.state.messages.map((message) => {
                       return(
                        <div>
                            <div>{message.from_id}</div>
                            <div>{message.message}</div>
                        </div>
                       )
                    })}
                </div>
                <p>Plaats een bericht</p>
                <form action={`http://localhost:4000/placemessage?thisUserID='${thisUser}'`} method="POST">
                    <textarea name="message" rows="4" cols="50"></textarea>
                    <button type="submit">Plaats bericht</button>
                </form>
                
            </div>
        );
    }
}

export default messages;