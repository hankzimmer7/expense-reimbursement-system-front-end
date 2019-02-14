import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/raynors-raiders-logo.png';

export class NavComponent extends React.Component<any, any> {
  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-expand-lg navbar-dark display-front nav-pad">
        <div className="navbar-header c-pointer shift-left">
          <Link to="/home" className="navbar-brand unset-anchor">
            <img className="img-adjust-position logo" src={Logo} alt="logo" />
            ERS
          </Link>
        </div>
        {this.props.loggedIn && (
          <React.Fragment>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarsExample04">
              <ul className="navbar-nav ml-auto margin-nav">
                <li className="navbar-non-link">
                  {this.props.loggedIn ? `Hello, ${this.props.user.firstName}  ${this.props.user.lastName}!` : ''}
                </li>
                {(this.props.user.role === ('user')) || (
                  <React.Fragment>
                    <li className="nav-item active">
                      <Link to="/users" className="unset-anchor nav-link">Users</Link>
                    </li>
                    <li className="nav-item active">
                      <Link to="/reimbursements" className="unset-anchor nav-link">Reimbursements</Link>
                    </li>
                  </React.Fragment>
                )}
                <li className="nav-item active">
                  <Link to="#" className="unset-anchor nav-link" onClick={this.props.logout}>Logout</Link>
                </li>
              </ul>
            </div>
          </React.Fragment>
        )}
      </nav>
    )
  }
}

export default NavComponent;