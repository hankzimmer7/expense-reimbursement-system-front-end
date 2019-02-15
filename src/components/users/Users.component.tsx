import React from 'react';
import { Redirect } from 'react-router-dom';
import expenseClient from '../../axios/expense.client';
import User from '../../models/user';

interface UsersComponentState {
  users: User[]
  usersLoaded: boolean
  redirectTo: any
  searchInput: string
  searchMessage: string
  newUserIsBeingAdded: boolean
  usernameInput: string
  passwordInput: string
  firstNameInput: string
  lastNameInput: string
  emailInput: string
  roleInput: number
  newUserMessage: string
  currentlyEditingUser: number
  usernameUpdate: string
  firstNameUpdate: string
  lastNameUpdate: string
  emailUpdate: string
  roleUpdate: number
  updateUserMessage: string
}

export class UsersComponent extends React.Component<any, UsersComponentState> {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersLoaded: false,
      redirectTo: null,
      searchInput: '',
      searchMessage: '',
      newUserIsBeingAdded: false,
      usernameInput: '',
      passwordInput: '',
      firstNameInput: '',
      lastNameInput: '',
      emailInput: '',
      roleInput: 0,
      newUserMessage: '',
      currentlyEditingUser: 0,
      usernameUpdate: '',
      firstNameUpdate: '',
      lastNameUpdate: '',
      emailUpdate: '',
      roleUpdate: 0,
      updateUserMessage: ''
    }
  }

  // Load the users once the component mounts
  componentDidMount() {
    // If an admin or finance manager is logged in, load the users
    if (this.props.loggedIn && (this.props.user.role === 'admin' || this.props.user.role === 'finance-manager')) {
      this.loadUsers();
    } else {
      this.setState({
        redirectTo: '/login'
      })
    }
  }

  // Redirect if the user logged out
  componentDidUpdate() {
    if (!this.props.loggedIn) {
      this.setState({
        redirectTo: '/login'
      })
    }
  }

  // Load the users from the API and store the users in the component state
  loadUsers = () => {
    expenseClient.get('/users')
      .then(response => {
        this.setState({
          users: response.data,
          usersLoaded: true
        })
      })
      .catch(err => console.log(err));
  }

  // Handles search by username
  handleSearchUsername = (event) => {
    event.preventDefault();
    this.setState({
      searchMessage: ''
    }, () => {
      if (this.state.searchInput !== '') {
        expenseClient.get(`/users/username/${this.state.searchInput}`)
          .then(response => {
            if (response.data.length > 0) {
              this.setState({
                users: response.data,
                usersLoaded: true,
              })
            } else {
              this.setState({
                usersLoaded: false,
                searchMessage: 'No users found'
              })
            }
          })
          .catch(err => console.log(err));
      } else {
        this.loadUsers();
      }
    })
  };

  // Handles clearing the current username search
  handleClearSearch = () => {
    this.loadUsers();
    this.setState({
      searchInput: '',
      searchMessage: ''
    })
  }

  // Handles all input changes
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value,
      newUserMessage: '',
      updateUserMessage: ''
    })
  }

  // Handles clicking the button to add a new user
  handleNewUser = () => {
    this.setState({
      newUserIsBeingAdded: true
    })
  }

  // When the admin clicks the submit button for a new user
  handleSubmitUser = () => {
    if (this.state.usernameInput === '') {
      this.setState({
        newUserMessage: 'Please enter a username'
      })
    } else if (this.state.passwordInput === '') {
      this.setState({
        newUserMessage: 'Please enter a password'
      })
    } else if (this.state.firstNameInput === '') {
      this.setState({
        newUserMessage: 'Please enter a first name'
      })
    } else if (this.state.lastNameInput === '') {
      this.setState({
        newUserMessage: 'Please enter a last name'
      })
    } else if (this.state.emailInput === '') {
      this.setState({
        newUserMessage: 'Please enter an email address'
      })
    } else if (this.state.roleInput === 0) {
      this.setState({
        newUserMessage: 'Please select a role'
      })
    }
    else {
      // Check if the username is already taken
      const usernameIsAlreadyTaken = this.state.users.find(user => user.username === this.state.usernameInput);
      if (usernameIsAlreadyTaken) {
        this.setState({
          newUserMessage: 'Username is already taken. Please enter a different username.'
        })
      } else {

        const newReimbursement = {
          username: this.state.usernameInput,
          password: this.state.passwordInput,
          firstName: this.state.firstNameInput,
          lastName: this.state.lastNameInput,
          email: this.state.emailInput,
          role: this.state.roleInput
        }
        expenseClient.post('/users', newReimbursement)
          .then(response => {
            this.setState({
              newUserIsBeingAdded: false,
              usernameInput: '',
              passwordInput: '',
              firstNameInput: '',
              lastNameInput: '',
              emailInput: '',
              newUserMessage: '',
              roleInput: 0,
            })
            this.loadUsers();
          })
          .catch(err => console.log(err))
      }
    }
  }

  // When the user clicks the button to cancel submitting a user
  handleCancelSubmitUser = () => {
    this.setState({
      newUserIsBeingAdded: false,
      newUserMessage: ''
    })
  }

  // When the user clicks the button to update a user, set that as the currently editing user
  handleUpdateUser = (event) => {
    const userId = +event.target.value;
    // Find the user being updated in the users array on state
    let userBeingUpdated;
    expenseClient.get(`/users/nojoin/${userId}`)
      .then(response => {
        userBeingUpdated = response.data
        if (userBeingUpdated) {
          this.setState({
            currentlyEditingUser: userId,
            usernameUpdate: userBeingUpdated.username,
            firstNameUpdate: userBeingUpdated.firstName,
            lastNameUpdate: userBeingUpdated.lastName,
            emailUpdate: userBeingUpdated.email,
            roleUpdate: userBeingUpdated.role
          })
        }
      }
      ).catch(err => console.log(err));
  }

  // When the user clicks the button to cancel updating reimbursement
  handleCancelUpdateUser = () => {
    this.setState({
      currentlyEditingUser: 0,
      updateUserMessage: ''
    })
  }

  // When the admin clicks the button to save changes to a user
  handleSaveUpdatedUser = () => {
    const updatedUser = {
      userId: this.state.currentlyEditingUser,
      username: this.state.usernameUpdate,
      firstName: this.state.firstNameUpdate,
      lastName: this.state.lastNameUpdate,
      email: this.state.emailUpdate,
      role: +this.state.roleUpdate
    }
    if (updatedUser.role === 0) {
      this.setState({
        updateUserMessage: 'Please select a role'
      })
    } else {
      expenseClient.patch('/users', updatedUser)
        .then(response => {
          this.setState({
            currentlyEditingUser: 0,
            updateUserMessage: ''
          }, () => {
            this.loadUsers();
          })
        })
        .catch(err => console.log(err))
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
      return (
        <React.Fragment>
          {this.props.loggedIn ? (

            <div className="jumbotron content-area">
              <h2>Users</h2>

              <form className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="searchInput"
                  value={this.state.searchInput}
                  placeholder="Search..."
                  onChange={this.handleInputChange} />
                <span className="input-group-btn">
                  <button className="btn" type="submit" onClick={this.handleSearchUsername}>Find User</button>
                </span>
                <span className="input-group-btn">
                  <button className="btn" type="button" onClick={this.handleClearSearch}>Clear Search</button>
                </span>
              </form>
              <div className="mb-3">{this.state.searchMessage}</div>
              {this.state.usersLoaded ? (
                <React.Fragment>
                  <div className="table-wrapper">
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
                            {this.state.currentlyEditingUser === user.userId ? (
                              <React.Fragment>
                                <td>
                                  <div className="input-group input-group-sm">
                                    <input type="text"
                                      name="usernameUpdate"
                                      className="form-control"
                                      aria-label="Username" aria-describedby="username-update"
                                      value={this.state.usernameUpdate}
                                      onChange={this.handleInputChange} />
                                  </div>
                                </td>
                                <td>
                                  <div className="input-group input-group-sm">
                                    <input type="text"
                                      name="firstNameUpdate"
                                      className="form-control"
                                      aria-label="First Name" aria-describedby="first-name-update"
                                      value={this.state.firstNameUpdate}
                                      onChange={this.handleInputChange} />
                                  </div>
                                </td>
                                <td>
                                  <div className="input-group input-group-sm">
                                    <input type="text"
                                      name="lastNameUpdate"
                                      className="form-control"
                                      aria-label="Last Name" aria-describedby="last-name-update"
                                      value={this.state.lastNameUpdate}
                                      onChange={this.handleInputChange} />
                                  </div>
                                </td>
                                <td>
                                  <div className="input-group input-group-sm">
                                    <input
                                      type="text"
                                      name="emailUpdate"
                                      className="form-control"
                                      aria-label="Email" aria-describedby="email-update"
                                      value={this.state.emailUpdate}
                                      onChange={this.handleInputChange} />
                                  </div>
                                </td>
                                <td>
                                  <div className="input-group input-group-sm custom-select-wrapper">
                                    <select
                                      className="custom-select"
                                      name="roleUpdate"
                                      value={this.state.roleUpdate}
                                      onChange={this.handleInputChange}
                                    >
                                      <option value="0">Role...</option>
                                      <option value="1">admin</option>
                                      <option value="2">finance-manager</option>
                                      <option value="3">user</option>
                                    </select>
                                  </div>
                                </td>
                                <td className="no-border">
                                  <button
                                    type="submit"
                                    className="btn btn-small"
                                    value={user.userId}
                                    onClick={this.handleSaveUpdatedUser}
                                  >
                                    Save
                            </button>
                                </td>
                                <td className="no-border">
                                  <button
                                    type="button"
                                    className="btn btn-small"
                                    onClick={this.handleCancelUpdateUser}
                                  >
                                    Cancel
                            </button>
                                </td>
                                <td className="text-danger no-border">{this.state.updateUserMessage}</td>
                              </React.Fragment>
                            ) : (
                                <React.Fragment>
                                  <td>{user.username}</td>
                                  <td>{user.firstName}</td>
                                  <td>{user.lastName}</td>
                                  <td>{user.email}</td>
                                  <td>{user.role}</td>
                                  {(this.state.currentlyEditingUser === 0) && (this.props.user.role === 'admin') ? (
                                    <td className="no-border">
                                      <button
                                        type="button"
                                        className="btn btn-small"
                                        value={user.userId}
                                        onClick={this.handleUpdateUser}
                                      >
                                        Edit
                                </button>
                                    </td>
                                  ) : (
                                      null
                                    )}
                                </React.Fragment>
                              )}
                          </tr>
                        ))
                        }
                        {this.state.newUserIsBeingAdded ? (
                          <tr >
                            <td>
                              <div className="input-group input-group-sm">
                                <input type="text"
                                  name="usernameInput"
                                  className="form-control" placeholder="Username" aria-label="Username" aria-describedby="username-input"
                                  value={this.state.usernameInput}
                                  onChange={this.handleInputChange} />
                              </div>
                            </td>
                            <td>
                              <div className="input-group input-group-sm">
                                <input type="text"
                                  name="firstNameInput"
                                  className="form-control" placeholder="First Name" aria-label="First Name" aria-describedby="first-name-input"
                                  value={this.state.firstNameInput}
                                  onChange={this.handleInputChange} />
                              </div>
                            </td>
                            <td>
                              <div className="input-group input-group-sm">
                                <input type="text"
                                  name="lastNameInput"
                                  className="form-control" placeholder="Last Name" aria-label="Last Name" aria-describedby="last-name-input"
                                  value={this.state.lastNameInput}
                                  onChange={this.handleInputChange} />
                              </div>
                            </td>
                            <td>
                              <div className="input-group input-group-sm">
                                <input type="email"
                                  name="emailInput"
                                  className="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-input"
                                  value={this.state.emailInput}
                                  onChange={this.handleInputChange} />
                              </div>
                            </td>
                            <td>
                              <div className="input-group input-group-sm custom-select-wrapper">
                                <select
                                  className="custom-select"
                                  name="roleInput"
                                  value={this.state.roleInput}
                                  onChange={this.handleInputChange}
                                >
                                  <option value="0">Role...</option>
                                  <option value="1">admin</option>
                                  <option value="2">finance-manager</option>
                                  <option value="3">user</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className="input-group input-group-sm">
                                <input type="password"
                                  name="passwordInput"
                                  className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-input"
                                  value={this.state.passwordInput}
                                  onChange={this.handleInputChange} />
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>

                  {this.props.user.role === 'admin' ? (
                    this.state.newUserIsBeingAdded ? (
                      <React.Fragment>
                        <p className="text-danger">{this.state.newUserMessage}</p>
                        <button
                          type="submit"
                          id="submit-user-button-div"
                          className="btn btn-small btn-space"
                          value="Submit User"
                          onClick={this.handleSubmitUser}>
                          Submit User</button>
                        <button
                          type="button"
                          className="btn btn-small"
                          onClick={this.handleCancelSubmitUser}>
                          Cancel</button>
                      </React.Fragment>
                    ) : (
                        <button
                          type="submit"
                          id="new-user-button"
                          className="btn btn-small"
                          value="New User"
                          onClick={this.handleNewUser}>
                          New User</button>
                      )
                  ) : null}
                </React.Fragment>
              ) : null}
            </div>
          ) : null}
        </React.Fragment>
      )
    }
  }
}

export default UsersComponent;