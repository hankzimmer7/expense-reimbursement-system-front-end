import React from 'react';

export class ChuckNorrisJokesComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      joke: 'A snake bit Chuck Norris. After 5 painful days, the snake died.'
    }
  }

  componentDidMount() {
    this.newJoke();
  }

  newJoke = async() => {
    try {
      const resp = await fetch('http://api.icndb.com/jokes/random?limitTo=[nerdy]');
      const body = await resp.json();
      this.setState({
        joke: body.value.joke
      })
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <h1>Chuck Norris Jokes Component</h1>
        <p>Joke: {this.state.joke}</p>
        <button className="btn btn-primary" onClick={this.newJoke}>New Joke</button>
      </div>
    )
  }

}