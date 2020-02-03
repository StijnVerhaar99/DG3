import React, { Component } from 'react';

class pictures extends Component {

    state = {
        pictures: []
    }

    componentDidMount() {
        this.getPictures();
    }

    getPictures() {
        fetch('http://localhost:4000/getpictures')
        .then(response => response.json())
        .then(response => this.setState({ pictures: response.data}))
    }

    render() {
        return (
            <div>
                <h1>Foto's</h1>
                <form action="http://localhost:4000/uploadpicture" method="POST" enctype="multipart/form-data">
                    <p>Upload foto's</p>
                    <input name="MyImage" type="file"></input>
                    <button type="submit" >Upload</button>
                </form>
                <div>
                    {this.state.pictures.map((picture) => {
                    return <img src={require(`../uploads/${picture.url}`)} alt='' height='250' width='250'></img>
                    })}
                </div>
            </div>
        );
    }
}

export default pictures;