import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';
import moment from 'moment';

import Chart from './Chart';

require('moment/locale/pl');
moment.locale('pl');

class App extends Component {
  constructor() {
    super();

    this.state = {
      code: '',
      data: null,
      error: '',
      displayChart: 'month' 
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

  addCode = e => {
    e.preventDefault();
    const { code, data } = this.state;
    if (code === '') return;
    if (code in data) {
      console.log('data is already in state');
      return;
    } else {
      this.socket.emit('addCurr', code.toUpperCase());
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
        <form onSubmit={e => this.addCode(e)}>
          <label htmlFor="code">Kod waluty (np. USD, CHF)</label>
          <input type="text" onChange={e => this.setState({ code: e.target.value })} name="code" style={{textTransform: "uppercase"}}  />
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
                    labels.push(moment(rate.effectiveDate).format('DD MMM'));
                    data.push(rate.mid);
                  });
                  let monthLabels = labels.slice(-21); // dwa rodzaje wykresów: rok / miesiąc
                  let monthData = data.slice(-21); // a to przenieśc do chart
                  return (
                    <div key={i}>
                      <li>{code} {currency} {Number(rates[rates.length - 1].mid).toFixed(2)}PLN {rates[rates.length - 1].effectiveDate} <span onClick={() => this.deleteCode(code)}>&#x2717;</span></li>
                        <div onClick={() => this.setState({ displayChart: 'month' })}>1M</div>
                        <div onClick={() => this.setState({ displayChart: 'year' })}>1R</div>
                        <Chart code={code} labels={this.state.displayChart === 'month' ? monthLabels : labels} data={this.state.displayChart === 'month' ? monthData : data} points={this.state.displayChart === 'month'} /> 
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
