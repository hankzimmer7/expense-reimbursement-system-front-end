import React, { Component } from 'react';
import './App.css';
import './include/Bootstrap';
import { NavComponent } from './components/nav/Nav.component';
import { HomeComponent } from './components/home/Home.component';
import { BrowserRouter, Route } from 'react-router-dom';
import { ClickerComponent } from './components/clicker/Clicker.component';
import { SignInComponent } from './components/signin/SignIn.component';
import { FirstComponent } from './components/first/First.component';
import { SecondComponent } from './components/second/Second.component';
import { NestedComponent } from './components/nested/Nested.component';
import { MoviesComponent } from './components/movies/Movies.component';
import { ChuckNorrisJokesComponent } from './components/chucknorrisjokes/ChuckNorrisJokes.component';
import { TicTacToeGameComponent } from './components/tictactoegame/TicTacToeGame.component';
import { PokemonComponent } from './components/pokemon/Pokemon.component';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <NavComponent />
          <div className="container">
            <Route path='/home' component={HomeComponent} />
            <Route path='/sign-in' component={SignInComponent} />
            <Route path='/first' component={FirstComponent} />
            <Route path='/second' component={SecondComponent} />
            <Route path='/clicker' component={ClickerComponent} />
            <Route path='/movies' component={MoviesComponent} />
            <Route path='/tic-tac-toe' component={TicTacToeGameComponent} />
            <Route path='/chuck-norris' component={ChuckNorrisJokesComponent} />
            <Route path='/pokemon' component={PokemonComponent} />
            <Route path='/nested' component={NestedComponent} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
