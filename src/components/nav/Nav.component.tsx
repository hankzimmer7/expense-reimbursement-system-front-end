import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/raynors-raiders-logo.png';

export class NavComponent extends React.Component<any, any> {
  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-expand-lg navbar-dark bg-dark display-front nav-pad">
        <div className="navbar-header c-pointer shift-left">
          <Link to="/home" className="navbar-brand unset-anchor">
            <img className="img-adjust-position rev-logo" src={Logo} alt="protoss" />
            ERS
          </Link>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarsExample04">
          <div className="navbar-nav">
            {this.props.loggedIn ? `Hello, ${this.props.user.firstName}  ${this.props.user.lastName}!` : ''}
          </div>
          <ul className="navbar-nav ml-auto margin-nav">
            {/* <li className="nav-item active">
              <Link to="/login" className="unset-anchor nav-link">Login</Link>
            </li> */}
            {this.props.loggedIn && (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </ul>
        </div>
      </nav>
    )
  }
}

export default NavComponent;