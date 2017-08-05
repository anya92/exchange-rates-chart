import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: {},
      error: ''
    };
  }

  componentDidMount() {
    // eslint-disable-next-line
    const socket = this.socket = socketIoClient();
    socket.on('initialData', data => {
      this.setState({ data });
    });
    socket.on('currData', rates => {
      const { data } = this.state;
      this.setState({
        data: rates
      });
    });
    socket.on('errorMessage', error => this.setState({ error }));
  }

  addCode = (code) => {
    console.log(code);
    this.socket.emit('addCurr', code);
  }

  render() {
    return (
      <div>
        <h1>Kursy walut.</h1>
        <button onClick={() => this.addCode('EUR')}>Dodaj</button>
        
        {
          this.state.error
        }
      </div>
    );
  }
}

export default App;
