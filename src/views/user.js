import React, { Component } from 'react';
import '../css/style.css';

import Friends from './friends/friends';
import Pictures from './pictures';
import Messages from './messages';

class user extends Component {

    state = {
        user: [],
        visitUser: [],
        showView: true,
        showCustomize: false,
        showCustomizeAvatar: false,
        loggedUser: ''
    }

    componentDidMount() {
        this.getUserData();
        this.getThisUser();
        this.getLoggedData()
    }

    getLoggedData() {
        fetch('http://localhost:4000/getuserid')
        .then(response => response.json())
        .then(response => this.setState({ loggedUser: response.data}))
    }

    getUserData = () => {
        fetch(`http://localhost:4000/getuserdata?user=${this.getThisUser()}`)
        .then(response => response.json())
        .then(response => this.setState({ user: response.data}))
    }

    getThisUser() {
        var urlParams = new URLSearchParams(window.location.search);
        let thisUser = (urlParams.get('user')); 
        return thisUser;
    }

    home() {
        fetch(`http://localhost:4000/home`)
    }

    showViewHandler() {
        this.setState({ showView: true, showCustomize: false, showCustomizeAvatar: false })
    }

    showCustomizeHandler() {
        this.setState({ showView: false, showCustomize: true, showCustomizeAvatar: false })
    }

    showCustomizeAvatarHandler() {
        this.setState({ showView: false, showCustomize: false, showCustomizeAvatar: true })
    }

    render() {

        let userName = null;
        let userId = null;
        let userColor = null;
        let userAvatar = 'useravatar.png';
        let userFont = null;
        let thisUserId = null;

        let userView = null;
        let userCustomize = null;
        let userCustomizeAvatar = null;

        this.state.user.map((user) => {
            return (
                userName = user.name,
                userId = JSON.stringify(user.id),
                thisUserId = user.id,
                userColor = user.color,
                userFont = user.font,
                userAvatar = user.avatar
            )
        })

        const sameUser = thisUserId === this.state.loggedUser;

        let profielWijzigen = null;

        if(sameUser) {
            profielWijzigen = <button className='mid-button' onClick={this.showCustomizeHandler.bind(this)}>Profiel wijzigen</button>
        }

        let style = {
            backgroundColor: `${userColor}`,
        }

        let font = {
            fontFamily: `${userFont}`,
        }
        console.log(userAvatar)

        userView = (
            <div className='content' style={font}>
                <div className='info'>
                    <div className='info-card'>
                        <div className='component'>
                        <h3>{userName}</h3>
                        <img src={require(`../uploads/${userAvatar}`)} alt='' width='80px' height='90px' onClick={this.showCustomizeAvatarHandler.bind(this)} className='avatar'></img>   
                        {profielWijzigen} 
                        </div>
                    </div>
                    <div className='info-card'>
                        <Friends thisUser={userName} thisId={userId} sameUser={sameUser}/>
                    </div>
                </div>
                <div className='message-card'>
                    <Messages thisUser={userName} thisId={userId} />
                </div>
                <div className='photo-card'>
                    <Pictures thisUser={userName} thisId={userId} sameUser={sameUser}/> 
                </div>
            </div>
        )

        userCustomize = (
            <div className='content'>
                <div className='customize'>
                    <form action={`http://localhost:4000/updateprofile`} method="POST">
                        <div>
                            <label for="name">Naam </label>
                            <input type='text' name='name' id='name'></input>
                        </div>
                        <div>
                            <label for="color">Kleur profiel kleur </label>
                            <select id="color" name="color">
                                <option name='color' value="lightblue">Licht blauw</option>
                                <option name='color' value="salmon">Zalm</option>
                                <option name='color' value="coral">Koraal</option>
                                <option name='color' value="navy">Navy</option>
                            </select>
                        </div>
                        <div>
                            <label for="font">Kleur profiel font </label>
                            <select id="font" name="font">
                                <option name='font' value="arial">Arial</option>
                                <option name='font' value="roboto">Roboto</option>
                                <option name='font' value="courier">Courier</option>
                                <option name='font' value="verdana">Verdana</option>
                            </select>
                        </div>

                        <button type='submit' >Verstuur</button>
                    </form>
                </div>
            </div>
        )

        userCustomizeAvatar = (
            <div className='content'>
                <div className='customize'>
                    <form action={`http://localhost:4000/updateprofileavatar`} method="POST" enctype="multipart/form-data">
                        <label>Profiel foto </label>
                        <input name="useravatar" type="file"></input>
                        <button type='submit' >Verstuur</button>
                    </form>
                </div>
            </div> 
        )
        
        return (
            <div>
                <div className='header' style={style}>
                    <form action="http://localhost:4000/logout" method="POST">
                        <button type="submit" className='button' id='logout' style={style}>Log uit</button>
                    </form>
                    <form action="http://localhost:4000/home" method="POST">
                        <button type='submit' className='button' id='home' style={style}>Home</button>
                    </form>
                </div>

                {this.state.showView && userView}
                {this.state.showCustomize && userCustomize}
                {this.state.showCustomizeAvatar && userCustomizeAvatar}

            </div>
        );
    }
}

export default user;