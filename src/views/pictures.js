import React, { Component } from 'react';

class pictures extends Component {

    state = {
        pictures: []
    }

    componentDidMount() {
        this.getPictures();
    }

    getPictures() {
        fetch(`http://localhost:4000/getpictures?thisUserID=${this.getThisUser()}`)
        .then(response => response.json())
        .then(response => this.setState({ pictures: response.data}))
    }

    getThisUser() {
        var urlParams = new URLSearchParams(window.location.search);
        let thisUser = (urlParams.get('user')); 
        return thisUser;
    }

    render() {

        let uploadPicture = null;

        if(this.props.sameUser) {
            uploadPicture = <form action="http://localhost:4000/uploadpicture" method="POST" enctype="multipart/form-data">
                                <p>Upload foto's</p>
                                <input name="MyImage" type="file"></input>
                                <button type="submit" >Upload</button>
                            </form>
        }

        return (
            <div className='component'>
                <div className='photo-upload'> 
                    <h3>Foto's</h3>
                    {uploadPicture}
                </div>
                <div className='photo-view'>
                    {this.state.pictures.map((picture) => {
                    return <img className='photo-view-image' src={require(`../uploads/${picture.url}`)} alt=''></img>
                    })}
                </div>
                

            </div>
        );
    }
}

export default pictures;