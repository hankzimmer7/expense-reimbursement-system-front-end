import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { expenseClient } from '../../axios/expense.client';

export class LoginComponent extends Component<any, any> {

  constructor (props) {
    super (props);
      this.state = {
        username: '',
        password: '',
        message: '',
        redirectTo: null
      }
  }

  componentDidMount = () => {
      if (this.props.loggedIn) {
          this.setState({
              redirectTo: '/reimbursements'
          })
      }
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  //When the user clicks the "Log In" button
  handleFormSubmit = event => {
    event.preventDefault();
    if (!this.state.username) {
      return (
        this.setState({
          message: 'Please enter your username'
        }))
    }
    if (!this.state.password) {
      return (
        this.setState({
          message: 'Please enter your password'
        }))
    }
    //Post the login and see if the username and password are correct
    expenseClient
      .post('/login', {
        "username": this.state.username,
        "password": this.state.password
      })
      .then(response => {
        // console.log('response from /login:', response);
        if (response.status === 200) {
          // update App.tsx state
          this.props.updateUser({
              loggedIn: true,
              user: response.data
          })
          // update the state to redirect to dish search
          // console.log('Logged in succesfully');
          this.setState({
            redirectTo: '/reimbursements'
          })
        }
      }).catch(error => {
        console.log('login error: ', error);
        // Display to the user that there was a login error
        this.setState({
          message: 'Incorrect username or password'
        });
      })
  }

  render() {
    if (this.state.redirectTo) {
        return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {

    // console.log('Login component this.props.user', this.props.user)
    return (
      <div className="jumbotron content-area">
        <h2>Log In</h2>
        <p className="text-danger">{this.state.message}</p>
        <form>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block mb-3"
            value="Log In"
            onClick={this.handleFormSubmit}
          >
            Log In
          </button>
        </form>
      </div>

    )
    }
  };
};