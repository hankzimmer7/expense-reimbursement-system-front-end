import React from 'react';
import { Redirect } from 'react-router-dom';
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
      statusUpdate: 0
    }
  }

  // Load the reimbursements once the component mounts
  componentDidMount() {
    // console.log("Reimbursements.tsx this.props", this.props);
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
    console.log("Running Load All Reimbursements");
    expenseClient.get('/reimbursements')
      .then(response => {
        console.log('Reimbursements response.data', response.data);
        this.setState({
          reimbursements: response.data,
          reimbursementsLoaded: true
        }, () => {
          console.log('Reimbursements this.state:', this.state);
        });
      }
      )
      .catch(err => console.log(err));
  };

  // Loads all of the current user's reimbursements and stores them in the component state
  loadMyReimbursements = () => {
    expenseClient.get(`/reimbursements/author/userId/${this.props.user.userId}`)
      .then(response => {
        // console.log('Reimbursements response.data', response.data);
        this.setState({
          reimbursements: response.data,
          reimbursementsLoaded: true
        }, () => {
          // console.log('Reimbursements this.state:', this.state);
        });
      }
      )
      .catch(err => console.log(err));
  };

  // Handles all input changes
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  // Handles clicking the button to add a new reimbursement
  handleNewReimbursement = () => {
    // console.log("Clicked button to add a new reimbursement");
    this.setState({
      newReimbursementIsBeingAdded: true
    })
  }


  // When the user clicks the submit button for a new reimbursement
  handleSubmitReimbursement = () => {
    // console.log("Clicked button to submit reimbursement");
    // console.log("this.state", this.state);
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
      // console.log(newReimbursement);
      expenseClient.post('/reimbursements', newReimbursement)
        .then(response => {
          // console.log('Reimbursements post response.data', response.data);
          this.setState({
            newReimbursementIsBeingAdded: false,
            amountInput: '',
            descriptionInput: '',
            typeInput: '0',
            resolverInput: '0',
            message: '',
          })
          console.log("this.props.user.role", this.props.user.role);
          if (this.props.user.role === 'user') {
            this.loadMyReimbursements();
          } else {
            this.loadAllReimbursements();
          }
        })
        .catch(err => console.log(err))
    }
  }

  // When the user clicks the button to update a reimbursement, set that as the currently editing reimbursement
  handleUpdateReimbursement = (event) => {
    console.log("Clicked to update reimbursement")
    console.log("Reimbursements this.state", this.state);
    // console.log("event", event);
    // console.log("event.target.key", event.target.key);
    console.log("event.target", event.target);
    // console.log("event.target.value", event.target.value);

    const reimbursementId = +event.target.value;
    // Find the reimbursement being updated in the reimbursements array on state
    // const reimbursementBeingUpdated = this.state.reimbursements.find(obj => {
    //   return obj.reimbursementId === reimbursementId
    // })
    let reimbursementBeingUpdated;
    expenseClient.get(`/reimbursements/nojoin/${reimbursementId}`)
      .then(response => {
        // console.log('Reimbursements response.data', response.data);
        reimbursementBeingUpdated = response.data
        console.log("reimbursementBeingUpdated:", reimbursementBeingUpdated);
        console.log("reimbursementId", reimbursementId);
        if (reimbursementBeingUpdated) {
          this.setState({
            currentlyEditingReimbursement: reimbursementId,
            // amountUpdate: this.state.amountUpdate,
            // description: this.state.descriptionUpdate,
            statusUpdate: reimbursementBeingUpdated.status
            // status: this.state.statusUpdate,
            // type: this.state.typeUpdate[reimbursementId].status
          }, () => { console.log(this.state) })
        }
      }
      ).catch(err => console.log(err));

  }

  // When the user clicks the button to cancel updating reimbursement
  handleCancelUpdateReimbursement = () => {
    console.log("Clicked to cancel update reimbursement")
    this.setState({
      currentlyEditingReimbursement: 0
    }, () => { console.log(this.state) })
  }

  // When the manager or admin clicks the button to save changes to a reimbursement
  handleSaveUpdatedReimbursement = () => {
    console.log("Clicked to save changes");
    const updatedReimbursement = {
      reimbursementId: this.state.currentlyEditingReimbursement,
      // amount: this.state.amountUpdate,
      // description: this.state.descriptionUpdate,
      status: this.state.statusUpdate,
      // type: this.state.typeUpdate
    }
    // console.log(newReimbursement);
    expenseClient.patch('/reimbursements', updatedReimbursement)
      .then(response => {
        console.log('Reimbursements post response.data', response.data);
        this.setState({
          currentlyEditingReimbursement: 0
        }, () => {
          console.log("Loading Reimbursements");
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
                    <th>
                    </th>
                  </tr>
                </thead>



                <tbody>
                  {this.state.reimbursementsLoaded ? (
                    this.state.reimbursements.map(reimbursement => (
                      <tr key={reimbursement.reimbursementId}>
                        {/* {console.log("typeof this.state.currentlyEditingReimbursement", typeof this.state.currentlyEditingReimbursement)}
                  {console.log("typeof reimbursement.reimbursementId",typeof reimbursement.reimbursementId)              }
                  {console.log("(this.state.currentlyEditingReimbursement === reimbursement.reimbursementId)",(this.state.currentlyEditingReimbursement === reimbursement.reimbursementId))} */}
                        {(this.state.currentlyEditingReimbursement == reimbursement.reimbursementId) ? (
                          <React.Fragment>
                            <td>{reimbursement.author}</td>
                            <td>{reimbursement.amount}</td>
                            <td>{moment(reimbursement.dateSubmitted).format('MMM D, YYYY')}</td>
                            <td>{(moment(reimbursement.dateResolved).format('MMM D, YYYY') === 'Jan 1, 1900') ? 'Not Resolved' : (moment(reimbursement.dateResolved).format('MMM D, YYYY'))}</td>
                            <td>{reimbursement.description}</td>
                            <td>{reimbursement.type}</td>
                            <td>{reimbursement.resolver}</td>
                            <td>
                              <div className="input-group input-group-sm">
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
                            <td>
                              <button
                                type="button"
                                className="btn btn-success"
                                value={reimbursement.reimbursementId}
                                onClick={this.handleSaveUpdatedReimbursement}
                              >
                                Save
                            </button>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-dark"
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
                              <td>{(moment(reimbursement.dateResolved).format('MMM D, YYYY') === 'Jan 1, 1900') ? 'Not Resolved' : (moment(reimbursement.dateResolved).format('MMM D, YYYY'))}</td>
                              <td>{reimbursement.description}</td>
                              <td>{reimbursement.type}</td>
                              <td>{reimbursement.resolver}</td>
                              <td>{reimbursement.status}</td>
                              <td>
                                {(this.state.currentlyEditingReimbursement === 0) && (this.props.user.role !== 'user') ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    value={reimbursement.reimbursementId}
                                    onClick={this.handleUpdateReimbursement}
                                  >
                                    Edit
                                </button>
                                ) : (
                                    null
                                  )}
                              </td>

                            </React.Fragment>
                          )}
                      </tr>
                    ))
                  ) : (<tr><td>Loading...</td></tr>
                    )}
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
                        <div className="input-group input-group-sm">
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
                        <div className="input-group input-group-sm">
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
          ) : (
              null
            )}
          {this.state.newReimbursementIsBeingAdded ? (
            <React.Fragment>
              <p className="text-danger">{this.state.message}</p>
              <button
                type="submit"
                id="submit-reimbursement-button-div"
                className="btn btn-primary"
                value="New Reimbursement"
                onClick={this.handleSubmitReimbursement}
              >
                Submit Reimbursement
            </button>
            </React.Fragment>
          ) : (
              <button
                type="button"
                id="new-reimbursement-button"
                className="btn btn-primary"
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