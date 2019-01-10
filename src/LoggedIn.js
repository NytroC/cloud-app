import React, { Component } from 'react';
import firebase from './firebase.js';
import ReactDOM from 'react-dom';
import './LoggedIn.css'

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      uid: ''
    }
  }

  render() {
    return (
      <div class="container">
        <div class="jumbotron mt-2">
          <div class="text-center">
            <p>User Details</p>
          </div>
        </div>
      </div>
    );
  }
  }

export default LoggedIn;
