import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import expenseClient from '../../axios/expense.client';

class LoginComponent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: '',
      redirectTo: null
    }
  }

  // Redirect if the user is logged in
  componentDidUpdate() {
    if (this.props.loggedIn) {
      this.setState({
        redirectTo: '/reimbursements'
      })
    }
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      message: ''
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
    } else {
      //Post the login and see if the username and password are correct
      expenseClient
        .post('/login', {
          "username": this.state.username,
          "password": this.state.password
        })
        .then(response => {
          if (response.status === 200) {
            // update App.tsx state
            this.props.updateUser({
              loggedIn: true,
              user: response.data,
              userCheckDone: true
            })
          }
        }).catch(error => {
          // Display to the user that there was a login error
          this.setState({
            message: 'Incorrect username or password. Both are case sensitive.'
          });
        })
    }
  }

  handleAdminLoginDemo = () => {
    expenseClient
        .post('/login', {
          "username": 'raynor',
          "password": 'marshall'
        })
        .then(response => {
          if (response.status === 200) {
            // update App.tsx state
            this.props.updateUser({
              loggedIn: true,
              user: response.data,
              userCheckDone: true
            })
          }
        }).catch(error => {
          // Display to the user that there was a login error
          this.setState({
            message: 'Incorrect username or password. Both are case sensitive.'
          });
        })
  }

  handleManagerLoginDemo = () => {
    expenseClient
        .post('/login', {
          "username": 'nova',
          "password": 'ghost'
        })
        .then(response => {
          if (response.status === 200) {
            // update App.tsx state
            this.props.updateUser({
              loggedIn: true,
              user: response.data,
              userCheckDone: true
            })
          }
        }).catch(error => {
          // Display to the user that there was a login error
          this.setState({
            message: 'Incorrect username or password. Both are case sensitive.'
          });
        })
  }

  handleUserLoginDemo = () => {
    expenseClient
        .post('/login', {
          "username": 'fenix',
          "password": 'fenix'
        })
        .then(response => {
          if (response.status === 200) {
            // update App.tsx state
            this.props.updateUser({
              loggedIn: true,
              user: response.data,
              userCheckDone: true
            })
          }
        }).catch(error => {
          // Display to the user that there was a login error
          this.setState({
            message: 'Incorrect username or password. Both are case sensitive.'
          });
        })
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
      return (
        <div className="jumbotron login-page-content">
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
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-block"
                value="Log In"
                onClick={this.handleFormSubmit}
              >
                Log In
              </button>
            </div>
            <div className="form-group">
              <div>For Demonstration Purposes:</div>
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn btn-block"
                value="Log In"
                onClick={this.handleAdminLoginDemo}
              >
                Log In As Admin
          </button>
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn btn-block"
                value="Log In"
                onClick={this.handleManagerLoginDemo}
              >
                Log In As Manager
          </button>
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn btn-block"
                value="Log In"
                onClick={this.handleUserLoginDemo}
              >
                Log In As User
          </button>
            </div>
          </form>

        </div >

      )
    }
  };
};

export default LoginComponent;