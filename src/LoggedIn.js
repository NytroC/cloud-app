import React, { Component } from 'react';
import firebase from './firebase.js';
import ReactDOM from 'react-dom';
import './LoggedIn.css'
import uuid from 'uuid/v4';

const words = [
  'spoon',
  'fish',
  'wish',
  'squish',
  'squash',
  'wash',
  'tuna',
  'elephant',
  'panda',
  'koala',
  'iguana'
]


class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      index: 0,
      data: {},
    };
  }
  componentDidMount() {
    firebase.database().ref('notes/').once('value', snapShot => {
      this.setState({ data: snapShot.val(), loaded: true })
    });
  }

  render() {
    return (
      <div id ="main-container" class="container">
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
             <th>{i}</th>
             <td><button class="table-button" value={index} onClick={this.setIndex}>{JSON.stringify(data[a].title)}</button></td>
           </tr>
         )
       })}
     </tbody>
     </table>
     <div id="note-container"class="jumbotron mt-2">
       <h2>{data[this.state.index] ? JSON.stringify(data[this.state.index].title.replace(/"/g,"")): "Title"}</h2>
       <div id="note-body">
       <p>{data[this.state.index] ? JSON.stringify(data[this.state.index].body): "Click Note"}</p>
       </div>
     </div>
     </div>
   );
 };
 setIndex = (e) => {
   e.preventDefault();
   console.log(e.target.value)
   this.setState({index: e.target.value})
 }
 renderbody = (a) => {
    const { data } = this.state;
    return (
      <div>
        <p >{JSON.stringify(data[a]).body}</p>
      </div>
    );
  };
  createOne = (e) => {
    e.preventDefault();
    // we could await this promise, and re-set state, but firebase will just update it for us
    const id = uuid();
    firebase.database().ref('notes/').once('value', snapShot => {
      this.setState({ data: snapShot.val() })
    });
    firebase.database().ref(`notes/${id}`).set({
      title: words[Math.floor(Math.random() * Math.floor(words.length))],
      body: words[Math.floor(Math.random() * Math.floor(words.length))]
    });
    this.setState();
  };

  deleteOne = () => {
    // e.preventDefault();
    console.log("hey")
    firebase.database().ref('notes/').once('value', snapShot => {
      this.setState({ data: snapShot.val() })
    });
    var data = Object.keys(this.state.data);
    var first = Object.keys(this.state.data)[0];
    if(data.length > 1){
      firebase.database().ref(`notes/${first}`).remove();
    }
  };

  updateOne = (e) => {
    e.preventDefault();
    console.log("hey")
    firebase.database().ref('notes/').once('value', snapShot => {
      this.setState({ data: snapShot.val() })
    });
    const first = Object.keys(this.state.data)[0];
    firebase.database().ref(`notes/${first}`).update({
      title: words[Math.floor(Math.random() * Math.floor(words.length))],
      body: words[Math.floor(Math.random() * Math.floor(words.length))]
    });
  };

  }

export default LoggedIn;
