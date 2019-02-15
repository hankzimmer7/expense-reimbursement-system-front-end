import React, { Component } from 'react';
import './include/Bootstrap';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import NavComponent from './components/nav/Nav.component';
import LoginComponent from './components/login/Login.component';
import ReimbursementsComponent from './components/reimbursements/Reimbursements.component';
import UsersComponent from './components/users/Users.component';
import expenseClient from './axios/expense.client';

class App extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
      user: null,
      userCheckDone: false,
    }
  }

  // Check if a user is logged in when the component mounts
  componentDidMount = () => {
    this.checkUser();
  }

  // Check if a user is logged in on the API. If so, update the App's state accordingly
  checkUser = () => {
    expenseClient.get('/login/info').then(response => {
      if (response.data) {
        this.setState({
          loggedIn: true,
          user: response.data,
          userCheckDone: true
        })
      } else {
        this.setState({
          loggedIn: false,
          user: null,
          userCheckDone: true
        })
      }
    })
  }

  updateUser = userObject => {
    this.setState(userObject);
  }

  logout = (event) => {
    event.preventDefault();
    expenseClient.get('/logout').then(response => {
      if (response.status === 200) {
        this.setState({
          loggedIn: false,
          user: null,
          userCheckDone: false
        })
      }
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div className="main-area">
          <NavComponent
            loggedIn={this.state.loggedIn}
            user={this.state.user}
            logout={this.logout}
          />
          <div className="container">
            <Switch>
              <Route
                path='/login'
                render={(props) => <LoginComponent
                  {...props}
                  updateUser={this.updateUser}
                  user={this.state.user}
                  loggedIn={this.state.loggedIn} />
                } />
              <Route
                path='/users'
                render={(props) => <UsersComponent
                  {...props}
                  user={this.state.user}
                  loggedIn={this.state.loggedIn} />
                }
              />
              <Route
                path='/reimbursements'
                render={(props) => <ReimbursementsComponent
                  {...props}
                  user={this.state.user}
                  loggedIn={this.state.loggedIn} />
                }
              />
              <Redirect from='*' to='/reimbursements' />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
