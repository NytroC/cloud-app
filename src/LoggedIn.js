import React, { Component } from 'react';
import firebase from './firebase.js';
import ReactDOM from 'react-dom';
import './LoggedIn.css'

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
  }

  render() {
    return (
      <div class="container">
        <div class="jumbotron mt-2">
          <div class="text-center">
            <p>{this.currentUser.name}</p>
            <p>{this.currentUser.email}</p>
            <img src={this.currentUser.photoUrl}/>
            <p>{this.currentUser.emailVerified}</p>
            <p>{this.currentUser.uid}</p>
          </div>
        </div>
      </div>
    );
  }
  }

export default LoggedIn;
