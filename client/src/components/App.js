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
      this.setState({
        data: rates
      });
    });
    socket.on('errorMessage', error => this.setState({ error }));
  }

  addCode = (code) => {
    console.log(code);
    const { data } = this.state;
    if (code in data) {
      console.log('data is already in state');
      return;
    } else {
      this.socket.emit('addCurr', code);
    }
  }

  deleteCode = code => {
    console.log('delete', code);
    this.socket.emit('deleteCode', code);
  }

  render() {
    return (
      <div>
        <h1>Kursy walut.</h1>
        <button onClick={() => this.addCode('EUR')}>Dodaj</button>
        
        {
          this.state.error
        }
        <ol>
          {
            Object.keys(this.state.data).map((el, i) => {
              let { code, currency, rates } = this.state.data[el];
              return <li key={i}>{code} {currency} {Number(rates[rates.length - 1].mid).toFixed(2)}PLN {rates[rates.length - 1].effectiveDate} <span onClick={() => this.deleteCode(code)}>&#x2717;</span></li>
            })
          }
        </ol>  
      </div>
    );
  }
}

export default App;
