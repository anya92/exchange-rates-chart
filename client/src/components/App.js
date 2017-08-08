import React, { Component } from 'react';
import { render } from 'react-dom';
import socketIoClient from 'socket.io-client';
import moment from 'moment';

import SingleCurr from './SingleCurr';
const searchIcon = require('../icons/search.svg');

require('moment/locale/pl');
moment.locale('pl');

class App extends Component {
  constructor() {
    super();

    this.state = {
      code: '',
      data: null,
      error: '',
      loading: false 
    };
  }

  componentWillMount() {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) { // ESC
        document.querySelector('.modal').classList.remove('visible');
      }
    });
  }

  componentDidMount() {
    const socket = this.socket = socketIoClient();
    socket.on('initialData', data => {
      this.setState({ data });

    });
    socket.on('currData', rates => {
      this.setState({
        data: rates,
        loading: false
      });
      document.querySelector('.modal').classList.remove('visible');
      // window.scrollTo(0, document.body.scrollHeight);
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
      this.setState({ loading: true });
    }
    this.input.value = '';

  }

  deleteCode = code => {
    console.log('delete', code);
    this.socket.emit('deleteCode', code);
  }

  openModal = () => {
    document.querySelector('.modal').classList.add('visible');
  }

  closeModal = () => {
    document.querySelector('.modal').classList.remove('visible');
  }

  render() {
    
    return (
      <div>
        <div className="header">
          <h1 className="header__title">Kursy walut</h1>
          <img src={searchIcon} alt="search" onClick={() => this.openModal()} className="header__search" />
        </div>
        <div className="container">
          <div className="modal">
            {
              this.state.loading
              ? <div className="loading__spinner"></div>
              : (
                  <form className="form" onSubmit={e => this.addCode(e)}>
                    <p className="form__close" onClick={() => this.closeModal()}>&#10005;</p>
                    <div className="form__content">
                      <label htmlFor="code" className="form__content__label">Kod waluty (np. USD, CHF)</label><br/>
                      <input type="text" onChange={e => this.setState({ code: e.target.value })} name="code" style={{textTransform: "uppercase"}} ref={ref => (this.input = ref)} className="form__content__input" autoFocus />
                      <button type="submit" className="form__content__button"><img src={searchIcon} alt="search"/></button>

                    </div>
                  </form>

                )
            } 
          </div>
          {
            this.state.error
          }
            {
              this.state.data
              ? (
                  Object.keys(this.state.data).map((el, i) => {
                    let { code, currency, rates } = this.state.data[el];
                    
                    return (
                      <SingleCurr key={i} currency={currency} code={code} rates={rates} deleteCode={this.deleteCode}/>
                    )
                    // rates.forEach(rate => {
                    //   labels.push(moment(rate.effectiveDate).format('DD MMM'));
                    //   data.push(rate.mid);
                    // });
                    // let monthLabels = labels.slice(-(labels.length / 12)); // dwa rodzaje wykresów: rok / miesiąc
                    // let monthData = data.slice(-(data.length / 12)); // a to przenieśc do chart
                    // console.log(-(labels.length / 12));
                    // return (
                    //   <div key={i}>
                    //     <li>{code} {currency} {Number(rates[rates.length - 1].mid).toFixed(4)}PLN {rates[rates.length - 1].effectiveDate} <span onClick={() => this.deleteCode(code)}>&#x2717;</span></li>
                    //       <div onClick={() => this.setState({ displayChart: 'month' })}>1M</div>
                    //       <div onClick={() => this.setState({ displayChart: 'year' })}>1R</div>
                    //       <Chart code={code} labels={this.state.displayChart === 'month' ? monthLabels : labels} data={this.state.displayChart === 'month' ? monthData : data} points={this.state.displayChart === 'month'} /> 
                    //   </div>  
                    // )
                  })
                )
              : <div className="loading__spinner"></div>
            } 

        </div>
      </div>
    );
  }
}

export default App;
