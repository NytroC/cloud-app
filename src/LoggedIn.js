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
    const user = firebase.auth().currentUser;
    this.currentUser = {};

     if (user != null) {
       this.currentUser.name = user.displayName;
       this.currentUser.email = user.email;
       this.currentUser.photoUrl = user.photoURL;
       this.currentUser.emailVerified = user.emailVerified;
       this.currentUser.uid = user.uid;
     }
    this.state = {
      loaded: false,
      index: 0,
      file: '',
      data: {},
      imageURLs:[],
      progress: 0,
      createNoteDisplay: "hidden-block",
      addedCategory: '',
      noteTitle: '',
      noteBody: '',
    };
  }
  componentDidMount() {
    firebase.database().ref(`notes/${this.currentUser.uid}`).on('value', snapShot => {
      if(snapShot.val() == null){
        return;
      }
      this.setState({ data: snapShot.val(), loaded: true })
    });
  }

  render() {
    const { data } = this.state;
    var {progress} = this.state;

    var progressBar = {
      width: `${progress}%`,
    };

    return (
      <div id="main-container" class="container">
      <div>
        <table id ="notes-table" class="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">Notes</th>
            </tr>
          </thead>
            {this.state.loaded ? this.renderTitles() : null}
            <div>
              <button id="create-button" onClick={this.displayCreateNote}>+</button>
              <button id="delete-button" onClick={this.deleteOne}>-</button>
            </div>
          </table>
        </div>
        <div id="note-container"class="jumbotron">
          <h2>{data[this.state.index] ? JSON.stringify(data[this.state.index].title.replace(/"/g,"")): "Title"}</h2>
          <div id="note-body">
             <p>{data[this.state.index] ? JSON.stringify(data[this.state.index].body): "Click Note"}</p>
             <div id="progress" style={progressBar}>{progress}%</div>
          </div>
          {this.state.imageURLs.map((url) => {
            return(
              <img src={url}/>
            )
          })}
          <div class='form-upload'>
            <input class="btn btn-dark" id="file-select" type='file' onChange={this.handleFileSelect}/>
            <button class="btn btn-dark" id="upload-button" onClick={this.fileUpload}>Upload</button>
          </div>
        </div>
        <form class="form-horizontal w-25" id={this.state.createNoteDisplay}>
          <div class="form-group">
            <label class="sr-only"/>
            <input class="form-control" type="noteTitle" name="noteTitle" placeholder="Title" value={this.state.noteTitle} id="noteTitle" onChange={this.handleChange}/>
          </div>
          <div class="form-group">
            <label class="sr-only"/>
            <input class="form-control" type="text" name="noteBody" placeholder="Note" value={this.state.noteBody} id="noteBody" onChange={this.handleChange}/>
          </div>
          <div class="form-group">
            <label class="sr-only"/>
            <input class="btn btn-dark" type="submit" value="Submit" onClick={this.createNote}/>
          </div>
        </form>
      </div>
    );
  }
  renderTitles = () => {
   const { data } = this.state;
   return (
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
   );
 };

 handleChange = (e) => {
   this.setState({
     [e.target.name]: e.target.value
   });
 }

 displayCreateNote = () => {
   if(this.state.createNoteDisplay == "hidden-block" ) {
     this.setState({createNoteDisplay: "shown-block"});
   } else {
     this.setState({createNoteDisplay: "hidden-block"});
   }
 }
 setIndex = async(e) => {
   e.preventDefault();
   await this.setState({index: e.target.value,currentNote: this.state.data[e.target.value]})
   this.setImages();
 }
 createCategory = () => {
   firebase.database().ref(`notes/${this.currentUser.uid}`).set({
     title: this.state.addedCategory,
   });
   this.setState();
 };
  createNote = (e) => {
    e.preventDefault();
    const id = uuid();
    firebase.database().ref(`notes/${this.currentUser.uid}/${id}`).set({
      title: this.state.noteTitle,
      body: this.state.noteBody,
      images: []
    });
    this.displayCreateNote();
    this.setState();
  };

  deleteOne = () => {
    var data = Object.keys(this.state.data);
    var first = Object.keys(this.state.data)[0];
    if(data.length > 1){
      firebase.database().ref(`notes/${this.currentUser.uid}/${first}`).remove();
      storage.child(`images/${this.currentUser.uid}/${first}`).delete().then(() => {

      }).catch(err => {
        console.log(err);
      });

    }
  };

  updateOne = () => {
    const first = Object.keys(this.state.data)[0];
    firebase.database().ref(`notes/${this.currentUser.uid}/${first}`).update({
      title: titles[Math.floor(Math.random() * Math.floor(titles.length))],
      body: notes_body[Math.floor(Math.random() * Math.floor(notes_body.length))]
    });
  };

  handleFileSelect = (e) => {
    this.setState({file: e.target.files[0]})
  };

  fileUpload = () => {
    const file = this.state.file;
    const currentNote = firebase.database().ref(`notes/${this.currentUser.uid}/${this.state.index}`);
    if(this.state.index != 0){
      currentNote.child("images").push({name: file.name});
      var imageUpload = storage.child(`images/${this.currentUser.uid}/${this.state.index}/${file.name}`).put(file);
      imageUpload.on('state_changed',
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.setState({progress: Math.round(progress)});
        },
        function(error){
          alert(`ERROR: ${error}`);
        },
        () => {
          this.setImages();
          this.setState({progress: 0})
        }
      );
    } else {
      console.log("no note selected");
    }
  };
  getImage = (image_name) => {
    storage.child(`images/${this.currentUser.uid}/${this.state.index}/${image_name}`).getDownloadURL().then((url) => {
      var joined = this.state.imageURLs.concat(url);
      this.setState({imageURLs: joined});
    })
  }
  setImages = () => {
    const { data } = this.state;
    this.setState({imageURLs:[]});
    if (data[this.state.index].images != null){
      Object.keys(data[this.state.index].images).map((key, index) => {
        const image_name = data[this.state.index].images[key].name;
        this.getImage(image_name);
      });
    }
  }

}

export default LoggedIn;
