import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import expenseClient from '../../axios/expense.client';
import Reimbursement from '../../models/reimbursement';
const moment = require('moment');

interface ReimbursementsComponentState {
  reimbursements: Reimbursement[]
  reimbursementsLoaded: boolean
  redirectTo: any
  newReimbursementIsBeingAdded: boolean
  amountInput: string
  descriptionInput: string
  typeInput: string
  resolverInput: string
  message: string
  currentlyEditingReimbursement: number
  amountUpdate: number
  descriptionUpdate: string
  typeUpdate: number
  statusUpdate: number
}

export class ReimbursementsComponent extends React.Component<any, ReimbursementsComponentState> {
  constructor(props) {
    super(props);
    this.state = {
      reimbursements: [],
      reimbursementsLoaded: false,
      redirectTo: null,
      newReimbursementIsBeingAdded: false,
      amountInput: '',
      descriptionInput: '',
      typeInput: '0',
      resolverInput: '0',
      message: '',
      currentlyEditingReimbursement: 0,
      amountUpdate: 0,
      descriptionUpdate: '',
      typeUpdate: 0,
      statusUpdate: 0
    }
  }

  // Load the reimbursements once the component mounts
  componentDidMount() {
    if (this.props.loggedIn) {
      if (this.props.user.role === 'user') {
        this.loadMyReimbursements();
      } else {
        this.loadAllReimbursements();
      }
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

  // Load all reimbursements from the API and store the reimbursements in the component state
  loadAllReimbursements = () => {
    expenseClient.get('/reimbursements')
      .then(response => {
        this.setState({
          reimbursements: response.data,
          reimbursementsLoaded: true
        });
      }
      )
      .catch(err => console.log(err));
  };

  // Loads all of the current user's reimbursements and stores them in the component state
  loadMyReimbursements = () => {
    expenseClient.get(`/reimbursements/author/userId/${this.props.user.userId}`)
      .then(response => {
        this.setState({
          reimbursements: response.data,
          reimbursementsLoaded: true
        }, () => {
        });
      }
      )
      .catch(err => console.log(err));
  };

  // Handles clicking the button to filter pending reimbursements
  handleFilterPending = () => {
    expenseClient.get('/reimbursements/status/1')
      .then(response => {
        this.setState({
          reimbursements: response.data,
          reimbursementsLoaded: true
        }, () => {
        });
      })
      .catch(err => console.log(err));
  };

  // Handles clicking the button to filter approved reimbursements
  handleFilterApproved = () => {
    expenseClient.get('/reimbursements/status/2')
      .then(response => {
        this.setState({
          reimbursements: response.data,
          reimbursementsLoaded: true
        }, () => {
        });
      })
      .catch(err => console.log(err));
  };

  // Handles clicking the button to filter denied reimbursements
  handleFilterDenied = () => {
    expenseClient.get('/reimbursements/status/3')
      .then(response => {
        this.setState({
          reimbursements: response.data,
          reimbursementsLoaded: true
        }, () => {
        });
      })
      .catch(err => console.log(err));
  };

  // Handles all input changes
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value
    })
  };

  // Handles clicking the button to add a new reimbursement
  handleNewReimbursement = () => {
    this.setState({
      newReimbursementIsBeingAdded: true
    })
  };


  // When the user clicks the submit button for a new reimbursement
  handleSubmitReimbursement = () => {

    //Check to ensure the fields are entered correctly
    if (isNaN(parseFloat(this.state.amountInput))) {
      this.setState({
        message: 'Amount must be a number'
      })
    } else if (this.state.descriptionInput === '') {
      this.setState({
        message: 'Please enter a description'
      })
    } else if (this.state.typeInput === '0') {
      this.setState({
        message: 'Please select a type'
      })
    } else if (this.state.resolverInput === '0') {
      this.setState({
        message: 'Please select a resolver'
      })
    } else {
      const newReimbursement = {
        author: this.props.user.userId,
        amount: this.state.amountInput,
        description: this.state.descriptionInput,
        type: this.state.typeInput,
        resolver: this.state.resolverInput
      }

      // Post the new reimbursement to the database
      expenseClient.post('/reimbursements', newReimbursement)
        .then(response => {
          this.setState({
            newReimbursementIsBeingAdded: false,
            amountInput: '',
            descriptionInput: '',
            typeInput: '0',
            resolverInput: '0',
            message: '',
          })
          if (this.props.user.role === 'user') {
            this.loadMyReimbursements();
          } else {
            this.loadAllReimbursements();
          }
        })
        .catch(err => console.log(err))
    }
  }

  // When the user clicks the button to cancel submitting a reimbursement
  handleCancelSubmitReimbursement = () => {
    this.setState({
      newReimbursementIsBeingAdded: false
    })
  }

  // When the user clicks the button to update a reimbursement, set that as the currently editing reimbursement
  handleUpdateReimbursement = (event) => {
    const reimbursementId = +event.target.value;
    let reimbursementBeingUpdated;
    // Load the current reimbursement from the database
    expenseClient.get(`/reimbursements/nojoin/${reimbursementId}`)
      .then(response => {
        reimbursementBeingUpdated = response.data
        if (reimbursementBeingUpdated) {
          this.setState({
            currentlyEditingReimbursement: reimbursementId,
            amountUpdate: reimbursementBeingUpdated.amount,
            descriptionUpdate: reimbursementBeingUpdated.description,
            typeUpdate: reimbursementBeingUpdated.type,
            statusUpdate: reimbursementBeingUpdated.status
          }, () => { console.log(this.state) })
        }
      }
      ).catch(err => console.log(err));
  }

  // When the user clicks the button to cancel updating reimbursement
  handleCancelUpdateReimbursement = () => {
    this.setState({
      currentlyEditingReimbursement: 0
    }, () => { console.log(this.state) })
  }

  // When the manager or admin clicks the button to save changes to a reimbursement
  handleSaveUpdatedReimbursement = () => {
    const updatedReimbursement = {
      reimbursementId: this.state.currentlyEditingReimbursement,
      amount: this.state.amountUpdate,
      description: this.state.descriptionUpdate,
      status: this.state.statusUpdate,
      type: this.state.typeUpdate
    }
    expenseClient.patch('/reimbursements', updatedReimbursement)
      .then(response => {
        this.setState({
          currentlyEditingReimbursement: 0
        }, () => {
          this.loadAllReimbursements();
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    // Current date is used for display when entering a new reimbursement
    let currentDate = new Date();
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
      return (
        <div className="jumbotron content-area clearfix">
          <h2>Reimbursements</h2>
          {this.props.loggedIn ? (
            <React.Fragment>
              {this.props.user.role !== 'user' ? (
                <div className="filtering-links-wrapper">
                  <button type="button" className="btn btn-space" onClick={this.loadAllReimbursements}>All</button>
                  <button type="button" className="btn btn-space" onClick={this.handleFilterPending}>Pending</button>
                  <button type="button" className="btn btn-space" onClick={this.handleFilterApproved}>Approved</button>
                  <button type="button" className="btn btn-space" onClick={this.handleFilterDenied}>Denied</button>
                </div>
              ) : null}
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Author</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Date Submitted</th>
                      <th scope="col">Date Resolved</th>
                      <th scope="col">Description</th>
                      <th scope="col">Type</th>
                      <th scope="col">Resolver</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.reimbursementsLoaded ? (
                      this.state.reimbursements.map(reimbursement => (
                        <tr key={reimbursement.reimbursementId}>
                          {this.state.currentlyEditingReimbursement == reimbursement.reimbursementId ? (
                            <React.Fragment>
                              <td>{reimbursement.author}</td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <input type="number"
                                    name="amountUpdate"
                                    className="form-control"
                                    aria-label="Amount" aria-describedby="Amount-update"
                                    value={this.state.amountUpdate}
                                    onChange={this.handleInputChange} />
                                </div>
                              </td>
                              <td>{moment(reimbursement.dateSubmitted).format('MMM D, YYYY')}</td>
                              <td>{(moment(reimbursement.dateResolved).format('MMM D, YYYY') === 'Jan 1, 1900') || (moment(reimbursement.dateResolved).format('MMM D, YYYY') === 'Dec 31, 1899') ? 'Not Resolved' : (moment(reimbursement.dateResolved).format('MMM D, YYYY'))}</td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <input type="text"
                                    name="descriptionUpdate"
                                    className="form-control"
                                    aria-label="Description" aria-describedby="description-update"
                                    value={this.state.descriptionUpdate}
                                    onChange={this.handleInputChange} />
                                </div>
                              </td>
                              <td>
                                <div className="input-group input-group-sm custom-select-wrapper">
                                  <select
                                    className="custom-select"
                                    name="typeUpdate"
                                    value={this.state.typeUpdate}
                                    onChange={this.handleInputChange}
                                  >
                                    <option value="0">Type...</option>
                                    <option value="1">Lodging</option>
                                    <option value="2">Travel</option>
                                    <option value="3">Food</option>
                                    <option value="4">Other</option>
                                  </select>
                                </div>
                              </td>
                              <td>{reimbursement.resolver}</td>
                              <td>
                                <div className="input-group input-group-sm custom-select-wrapper">
                                  <select
                                    className="custom-select"
                                    name="statusUpdate"
                                    value={this.state.statusUpdate}
                                    onChange={this.handleInputChange}
                                  >
                                    <option value="0">Status...</option>
                                    <option value="1">Pending</option>
                                    <option value="2">Approved</option>
                                    <option value="3">Denied</option>
                                  </select>
                                </div>
                              </td>
                              <td className="no-border">
                                <button
                                  type="button"
                                  className="btn btn-small"
                                  value={reimbursement.reimbursementId}
                                  onClick={this.handleSaveUpdatedReimbursement}
                                >
                                  Save
                            </button>
                              </td>
                              <td className="no-border">
                                <button
                                  type="button"
                                  className="btn btn-small"
                                  onClick={this.handleCancelUpdateReimbursement}
                                >
                                  Cancel
                            </button>
                              </td>
                            </React.Fragment>
                          ) : (
                              <React.Fragment>
                                <td>{reimbursement.author}</td>
                                <td>{reimbursement.amount}</td>
                                <td>{moment(reimbursement.dateSubmitted).format('MMM D, YYYY')}</td>
                                <td>{(moment(reimbursement.dateResolved).format('MMM D, YYYY') === 'Jan 1, 1900') || (moment(reimbursement.dateResolved).format('MMM D, YYYY') === 'Dec 31, 1899') ? 'Not Resolved' : (moment(reimbursement.dateResolved).format('MMM D, YYYY'))}</td>
                                <td>{reimbursement.description}</td>
                                <td>{reimbursement.type}</td>
                                <td>{reimbursement.resolver}</td>
                                <td>{reimbursement.status}</td>
                                {(this.state.currentlyEditingReimbursement === 0) && (this.props.user.role !== 'user') ? (
                                  <td className="no-border">
                                    <button
                                      type="button"
                                      className="btn btn-small"
                                      value={reimbursement.reimbursementId}
                                      onClick={this.handleUpdateReimbursement}
                                    >
                                      Edit
                                </button>
                                  </td>
                                ) : null}
                              </React.Fragment>
                            )}
                        </tr>
                      ))
                    ) : null}
                    {this.state.newReimbursementIsBeingAdded ? (
                      <tr >
                        <td>{`${this.props.user.firstName} ${this.props.user.lastName}`}</td>
                        <td>
                          <div className="input-group input-group-sm">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input type="text"
                              name="amountInput"
                              className="form-control" placeholder="Amount" aria-label="Amount" aria-describedby="amount-input"
                              value={this.state.amountInput}
                              onChange={this.handleInputChange} />
                          </div>
                        </td>
                        <td>{moment(currentDate).format('MMM D, YYYY')}</td>
                        <td></td>
                        <td>
                          <div className="input-group input-group-sm">
                            <input type="text"
                              name="descriptionInput"
                              className="form-control" placeholder="Description" aria-label="Description" aria-describedby="description-input"
                              value={this.state.descriptionInput}
                              onChange={this.handleInputChange} />
                          </div>
                        </td>
                        <td>
                          <div className="input-group input-group-sm custom-select-wrapper">
                            <select
                              className="custom-select"
                              name="typeInput"
                              value={this.state.typeInput}
                              onChange={this.handleInputChange}
                            >
                              <option value="0">Type...</option>
                              <option value="1">Lodging</option>
                              <option value="2">Travel</option>
                              <option value="3">Food</option>
                              <option value="4">Other</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="input-group input-group-sm custom-select-wrapper">
                            <select
                              className="custom-select"
                              name="resolverInput"
                              value={this.state.resolverInput}
                              onChange={this.handleInputChange}
                            >
                              <option value="0">Resolver...</option>
                              <option value="2">Kerrigan</option>
                              <option value="3">Tassadar</option>
                              <option value="4">Nova</option>
                            </select>
                          </div>
                        </td>
                        <td></td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </React.Fragment>
          ) : null}
          {this.state.newReimbursementIsBeingAdded ? (
            <React.Fragment>
              <p className="text-danger">{this.state.message}</p>
              <button
                type="submit"
                id="submit-reimbursement-button-div"
                className="btn btn-small btn-space"
                value="New Reimbursement"
                onClick={this.handleSubmitReimbursement}
              >
                Submit Reimbursement
            </button>
              <button
                type="button"
                className="btn btn-small"
                onClick={this.handleCancelSubmitReimbursement}
              >
                Cancel
                </button>
            </React.Fragment>
          ) : (
              <button
                type="button"
                id="new-reimbursement-button"
                className="btn btn-small"
                value="New Reimbursement"
                onClick={this.handleNewReimbursement}
              >
                New Reimbursement
            </button>
            )}
        </div>
      )
    }
  }
}

export default ReimbursementsComponent;