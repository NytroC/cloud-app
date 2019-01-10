import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import firebase from './firebase.js';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      signed_in: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleGoogle = this.handleGoogle.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(
       this.state.email,this.state.password)
      .then(user => {
        console.log("your in!")
        this.props.history.push("/LoggedIn");
      })
      .catch(err => {
        console.log(err)
    });
  }
  handleSignUp(e){
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(
      this.state.email, this.state.password)
      .then((user) => {
        console.log("your in!")
        this.props.history.push("/LoggedIn");
      }).catch(function(error) {
        console.log(error)
      });
  }
  handleGoogle(e){
    e.preventDefault();
    var googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(
          googleProvider).then((result) => {
              console.log(result);
              console.log("your in!")
              var user = result.user;
              this.props.history.push("/LoggedIn");
          }).catch(function (error) {
              //TODO: Handle Errors here.
              console.log(error);
          });

  }

  render() {
    return (
      <div class="container ">
        <div class="jumbotron mt-2">
        <div class="text-center">
          <p>Log in using your favorite method</p>
        </div>
        <form class="form align-items-center">
          <div class="form-group mx-auto w-25">
            <label class="sr-only" for="email">Email address</label>
            <input type="email" class="form-control" placeholder="Email" name="email" value={this.state.email} id="email" onChange={this.handleChange}></input>
          </div>
           <div class="form-group mx-auto w-25">
            <label class="sr-only" for="password">Password</label>
            <input type="password" class="form-control" placeholder="Password" name= "password" value={this.state.password} id="password" onChange={this.handleChange}></input>
          </div>
          <div class="text-center">
            <div class="btn-group col-md-3 align-items-center">
              <div class="btn">
                <button id="sign-up" class="button--accent btn-dark" onClick={this.handleSignUp}>Sign up</button>
              </div>
              <div class="btn">
                <button id="login" class="button--accent btn-dark " onClick={this.handleSubmit}>Sign in</button>
              </div>
            </div>
          </div>
        </form>
        <div class="text-center">Or</div><br></br>
        <div class="text-center">
          <a class="btn btn-social btn-lg btn-primary" id="goggleLogin" onClick={this.handleGoogle}>
            <span class="fa fa-snapchat-ghost"></span>
             Sign in with Google
          </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
