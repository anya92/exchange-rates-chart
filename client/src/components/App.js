import React, { Component } from 'react';
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
      const { code } = this.state;
      this.setState({
        data: rates,
        loading: false
      });
      document.querySelector('.modal').classList.remove('visible');
      document.getElementById(code.toUpperCase()).scrollIntoView();
    });
    socket.on('errorMessage', error => {
      this.setState({ error });
      setTimeout(() => {
        this.setState({ loading: false, error: '' });
      }, 1000);
    });
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
              ? <div>
                  <div className="loading__spinner"></div>
                  <p className="modal__error">{ this.state.error }</p>
                </div>
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
              this.state.data
              ? (
                  Object.keys(this.state.data).map((el, i) => {
                    let { code, currency, rates } = this.state.data[el];
                    return (
                      <SingleCurr key={i} currency={currency} code={code} rates={rates} deleteCode={this.deleteCode}/>
                    )
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
