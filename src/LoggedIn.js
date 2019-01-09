import React, { Component } from 'react';
import firebase from './firebase.js';
import ReactDOM from 'react-dom';

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      signedIn: this.props.signedIn
    }
  }

  render() {
    return (
      <div class="container">
        your in!
        </div>
    );
  }
  }

export default LoggedIn;
