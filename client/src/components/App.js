import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';

import Chart from './Chart';

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: null,
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
        <form onSubmit={() => this.addCode('EUR')}>
          <label htmlFor="code">Kod waluty (np. USD, CHF)</label>
          <input type="text" onChange={e => this.setState({ code: e.target.value })} name="code" />
          <button type="submit">Dodaj</button>
          
        </form>
        
        {
          this.state.error
        }
        <ol>
          {
            this.state.data
            ? (
                Object.keys(this.state.data).map((el, i) => {
                  let { code, currency, rates } = this.state.data[el];
                  let labels = [], data = [];
                  rates.forEach(rate => {
                    labels.push(rate.effectiveDate);
                    data.push(rate.mid);
                  });
                  return (
                    <div key={i}>
                      <li>{code} {currency} {Number(rates[rates.length - 1].mid).toFixed(2)}PLN {rates[rates.length - 1].effectiveDate} <span onClick={() => this.deleteCode(code)}>&#x2717;</span></li>
                      <Chart code={code} labels={labels} data={data} /> 
                    </div>  
                  )
                })
              )
            : <div></div>
          }
        </ol>  
      </div>
    );
  }
}

export default App;
