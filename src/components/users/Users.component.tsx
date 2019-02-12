import React from 'react';
import { Redirect } from 'react-router-dom';
import expenseClient from '../../axios/expense.client';
import User from '../../models/user';

interface UsersComponentState {
  users: User[]
  usersLoaded: boolean
  redirectTo: any
}

export class UsersComponent extends React.Component<any, UsersComponentState> {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersLoaded: false,
      redirectTo: null
    }
  }

  // Load the users once the component mounts
  componentDidMount() {
    // this.loadUsers();

    // console.log("Users.tsx this.props", this.props);
    // If an admin or finance manager is logged in, load the users
    if (this.props.loggedIn && (this.props.user.role === 'admin' || this.props.user.role === 'finance-manager')) {
      this.loadUsers();
    } else {
      this.setState({
        redirectTo: '/login'
      })
    }
  }

  // Load the users from the API and store the users in the component state
  loadUsers = () => {
    expenseClient.get('/users')
      .then(response => {
        console.log('Users response.data', response.data);
        this.setState({
          users: response.data,
          usersLoaded: true
        }, () => {

          console.log('Users this.state:', this.state);
        });
      }
      )
      .catch(err => console.log(err));
  };


  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
      return (
        <div className="jumbotron content-area">
          <h2>Users</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map(user => (
                <tr key={user.userId}>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))
              }
            </tbody>
          </table>
        </div>
      )
    }
  }
}

export default UsersComponent;