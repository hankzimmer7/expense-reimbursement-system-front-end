import React, { Component } from 'react';
import './include/Bootstrap';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { NavComponent } from './components/nav/Nav.component';
import { LoginComponent } from './components/login/Login.component';
import { ReimbursementsComponent } from './components/reimbursements/Reimbursements.component';
import { UsersComponent } from './components/users/Users.component';
import { expenseClient } from './axios/expense.client';

class App extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
      user: null,
      userCheckDone: false,
      // userData: [],
      // userLoaded: false
    }
  }

  // Check if a user is logged in when the component mounts
  componentDidMount = () => {
    this.checkUser();
  }

  // Check if a user is logged in on the API. If so, update the App's state accordingly
  checkUser = () => {
    // console.log("App.tsx running function checkUser");
    expenseClient.get('/login/info').then(response => {
      console.log("App.tsx checkUser response.data:", response.data);
      if (response.data) {
        this.setState({
          loggedIn: true,
          user: response.data,
          userCheckDone: true
        }, () => {
          // console.log("App.tsx checkUser got a response.");
          // console.log('App.tsx this.state', this.state);
        })
      } else {
        this.setState({
          loggedIn: false,
          user: null,
          userCheckDone: true
        }, () => {
          // console.log("App.tsx checkUser didn't get a response.");
          // console.log('App.tsx this.state', this.state);
        })
      }
    })
      // .then(() => {
      //   if (this.state.loggedIn) {
      //     // console.log("App.tsx checkUser: User is logged on. Running loadUser")
      //     this.loadUser();
      //   }
      // })
  }

  // loadUser = () => {
  //   // console.log("App.tsx running loadUser");
  //   if (this.state.user) {
  //     // console.log(`App.tsx loading user ${this.state.user.user_id}`);
  //     expenseClient.get(`/users/${this.state.user.user_id}`)
  //       .then(response => {
  //         if (response.data) {
  //           this.setState({
  //             user: response.data,
  //             userLoaded: true
  //           }, () => {
  //             // console.log('App.tsx this.state', this.state);
  //           });
  //         } else {
  //           console.log(`No response from get /api/users/${this.state.user.user_id}`)
  //         }
  //       })
  //   }
  // }

  updateUser = userObject => {
    this.setState(userObject);
  }

  login = (username, password) => {
    expenseClient.post('/login', {
      username,
      password
    })
      .then(response => {
        if (response.status === 200) {
          // update the state
          this.setState({
            loggedIn: true,
            // user: response.user,
            userCheckDone: false
          })
        }
      })
  }

  logout = (event) => {
    event.preventDefault();
    expenseClient.get('/logout').then(response => {
      console.log("Logout response.data", response.data);
      if (response.status === 200) {
        this.setState({
          loggedIn: false,
          user: null,
          userCheckDone: false
        })
      }
      window.location.reload();
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
