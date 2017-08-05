import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';

class App extends Component {
  componentDidMount() {
    const socket = socketIoClient();
  }

  render() {
    return (
      <div>
        <h1>Kursy walut.</h1>
      </div>
    );
  }
}

export default App;
