import React from 'react';
import { expenseClient } from '../../axios/expense.client';
import { Reimbursement } from '../../models/reimbursement';
// import * as moment from 'moment';
const moment = require('moment');

interface ReimbursementsComponentState {
  reimbursements: Reimbursement[]
  reimbursementsLoaded: boolean
}

export class ReimbursementsComponent extends React.Component <any, ReimbursementsComponentState> {
  constructor(props) {
    super(props);
    this.state = {
      reimbursements: [],
      reimbursementsLoaded: false
    }
  }

  // Load the reimbursements once the component mounts
  componentDidMount() {
    this.loadReimbursements();
  }

    // Load the reimbursements from the API and store the reimbursements in the component state
  loadReimbursements = () => {
    expenseClient.get('/reimbursements')
      .then(response => {
        console.log('Reimbursements response.data', response.data);
        console.log('Reimbursements response.data[0].dateResolved', response.data[0].dateResolved);
        console.log('moment(response.data[0].dateResolved).format()', moment(response.data[0].dateResolved).format('MMM D, YYYY'));
        let now = moment().format('LLLL');
        console.log('moment().format()', moment().format());
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

  render() {
    return (
      <div className="jumbotron content-area">
        <h2>Reimbursements</h2>
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
            {this.state.reimbursements.map(reimbursement => (
              <tr key={reimbursement.reimbursementId}>
                <td>{reimbursement.author}</td>
                <td>{reimbursement.amount}</td>
                <td>{moment(reimbursement.dateSubmitted).format('MMM D, YYYY')}</td>
                <td>{moment(reimbursement.dateResolved).format('MMM D, YYYY')}</td>
                <td>{reimbursement.description}</td>
                <td>{reimbursement.type}</td>
                <td>{reimbursement.resolver}</td>
                <td>{reimbursement.status}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    )
  }

}