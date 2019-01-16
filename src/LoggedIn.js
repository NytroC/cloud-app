import React, { Component } from 'react';
import firebase from './firebase.js';
import './LoggedIn.css'
import uuid from 'uuid/v4';

const titles = [
  'Fortnite',
  'World of Warcraft',
  'God of War',
  'FIFA 19',
  'Minecraft',
  'Atlas',
  'Battlfield V',
  'Assassin\'s Creed',
  'PUBG',
  'Red Dead Redemption 2',
  'Overwatch'
]

const notes_body = [
  'At the very least, it provides blistering firefights and brilliantly crafted worlds to have them in.',
  'Unquestionably 2018\'s best game, and an all-time open-world masterpiece.',
  'It\'s hard to say that this even can be classified as a game. ',
  'Fun to play with friends, not so much on your own.',
  'Despite some very annoying bugs that absolutely need to be addressed, the game is both a wonderful online experience and an underrated solo adventure if you enjoy the exploration aspect of games such as No Man’s Sky.',
  'Masterpiece. The world within game is so detailed and beautiful.',
  'This game is so historically innacurate it ruins my immersion, its not fun to play as a history major when you know nothing of this happened.',
  'I wanted to like the game, I hoped the new direction would bring the series to a new level, but instead, the whole thing blew up in my face like a Marshmallow Peep left in the microwave too long.',
  'You can feel the love Insomniac put into this game, and it goes a long way.',
  'The only thing this game has going for it is the art direction and world.',
  'Just your typical, not ready for release, trash'
]

const storage = firebase.storage().ref();

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      index: 0,
      file: '',
      data: {},
      imageURLs:[],
    };
  }
  componentDidMount() {
    firebase.database().ref('notes/').on('value', snapShot => {
      this.setState({ data: snapShot.val(), loaded: true })
    });
  }

  render() {
    return (
      <div id="main-container" class="container">
        <div>
          <button onClick={this.createOne}>Create New</button>
          <button onClick={this.updateOne}>Update One</button>
          <button onClick={this.deleteOne}>Delete One</button>
        </div>
        {this.state.loaded ? this.renderTitles() : null}

      </div>
    );
  }
  renderTitles = () => {
   const { data } = this.state;
   return (
     <div>
       <table id ="notes-table" class="table table-striped table-dark">
         <thead>
           <tr>
             <th scope="col">Notes</th>
           </tr>
         </thead>
       <tbody>
         {Object.keys(data).map((a, i) => {
           var index = a;
           return (
             <tr>
               <th class="table-th">{i}</th>
               <td><button class="table-button" value={index} onClick={this.setIndex}>{JSON.stringify(data[a].title)}</button></td>
             </tr>
           )
         })}
       </tbody>
       </table>
       <div id="note-container"class="jumbotron">
         <h2>{data[this.state.index] ? JSON.stringify(data[this.state.index].title.replace(/"/g,"")): "Title"}</h2>
         <div id="note-body">
            <p>{data[this.state.index] ? JSON.stringify(data[this.state.index].body): "Click Note"}</p>
         </div>
         <img src={this.state.imageURL}/>
         <div class='form-upload'>
           <input id="file-select" type='file' onChange={this.handleFileSelect}/>
           <button id="upload-button" onClick={this.fileUpload}>Upload</button>
         </div>
       </div>
     </div>
   );
 };
 setIndex = async(e) => {
   e.preventDefault();
   await this.setState({index: e.target.value,currentNote: this.state.data[e.target.value]})
   this.setImages();
 }
  createOne = () => {
    const id = uuid();
    firebase.database().ref(`notes/${id}`).set({
      title: titles[Math.floor(Math.random() * Math.floor(titles.length))],
      body: notes_body[Math.floor(Math.random() * Math.floor(notes_body.length))],
      images: []
    });
    this.setState();
  };

  deleteOne = () => {
    var data = Object.keys(this.state.data);
    var first = Object.keys(this.state.data)[0];
    if(data.length > 1){
      firebase.database().ref(`notes/${first}`).remove();
      storage.child(`images/${first}`).delete().then(() => {

      }).catch(err => {
        console.log(err);
      });

    }
  };

  updateOne = () => {
    const first = Object.keys(this.state.data)[0];
    firebase.database().ref(`notes/${first}`).update({
      title: titles[Math.floor(Math.random() * Math.floor(titles.length))],
      body: notes_body[Math.floor(Math.random() * Math.floor(notes_body.length))]
    });
  };

  handleFileSelect = (e) => {
    this.setState({file: e.target.files[0]})
  };

  fileUpload = () => {
    const file = this.state.file;
    const currentNote = firebase.database().ref(`notes/${this.state.index}`);
    if(this.state.index != 0){
      currentNote.child("images").push({name: file.name});
      storage.child(`images/${this.state.index}`).put(file).then(() => {
        console.log(this.state.data[this.state.index].images)
      });
    } else {
      console.log("no note selected");
    }
  };
  getImage = (image_name) => {
    storage.child(`images/${this.state.index}`).getDownloadURL().then((url) => {
      this.setState(prevState => ({imageURL:[...prevState.imageURLs, url]
      }));
    })
  }
  setImages = () => {
    const { data } = this.state;
    if (data[this.state.index].images != null){
      Object.keys(data[this.state.index].images).map((key, index) => {
        console.log(data[this.state.index].images[key].name);
        const image_name = data[this.state.index].images[key].name;
        this.getImage(image_name);
      });
    }
  }

}

export default LoggedIn;
