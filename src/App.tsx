import React, { Component } from 'react';
import './include/Bootstrap';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { NavComponent } from './components/nav/Nav.component';
import { HomeComponent } from './components/home/Home.component';
import { LoginComponent } from './components/login/Login.component';
import { ReimbursementsComponent } from './components/reimbursements/Reimbursements.component';
import { UsersComponent } from './components/users/Users.component';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="main-area">
          <NavComponent />
          <div className="container">
            <Route path='/home' component={HomeComponent} />
            <Route path='/login' component={LoginComponent} />
            <Route path='/users' component={UsersComponent} />
            <Route path='/reimbursements' component={ReimbursementsComponent} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
