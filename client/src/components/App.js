import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';

import SingleCurr from './SingleCurr';
const searchIcon = require('../assets/icons/search.svg');

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
        this.closeModal();
      }
      if (e.keyCode === 70 && e.ctrlKey) { // CTRL + F
        e.preventDefault();
        this.openModal();
      }
    });
  }

  componentDidMount() {
    const socket = this.socket = socketIoClient();
    socket.on('initialData', data => {
      this.setState({ data });
    });

    socket.on('afterAdd', rates => {
      const { data } = this.state;
      this.setState({
        data: Object.assign({}, data, rates),
        loading: false
      });
      this.closeModal();
      // document.getElementById(code.toUpperCase()).scrollIntoView();
    });

    socket.on('errorMessage', error => {
      this.setState({ error });
      setTimeout(() => {
        this.setState({ loading: false, error: '' });
      }, 1000);
    });

    socket.on('afterDelete', code => {
      const { data } = this.state;
      delete data[code];
      this.setState({ data });
    });
  }

  addCurrency = e => {
    e.preventDefault();
    const { code, data } = this.state;
    if (code === '') return;
    if (code.toUpperCase() in data) {
      // data is already in state
      this.closeModal();
      // document.getElementById(code.toUpperCase()).scrollIntoView(false);
      this.input.value = '';
      return;
    } else {
      this.socket.emit('add', code);
      this.setState({ loading: true });
    }
    this.input.value = '';
  }

  deleteCurrency = code => {
    const { data } = this.state;
    delete data[code];
    this.setState({ data });
    this.socket.emit('delete', code);
  }

  handleInputChange = e => {
    this.setState({
      code: e.target.value
    });
  }

  openModal = () => {
    document.querySelector('.modal').classList.add('visible');
    setTimeout(() => {
      this.input.focus();
    }, 100);
  }

  closeModal = () => {
    document.querySelector('.modal').classList.remove('visible');
    this.input.value = '';
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
                  <form className="form" onSubmit={e => this.addCurrency(e)}>
                    <p className="form__close" onClick={() => this.closeModal()}>&#10005;</p>
                    <div className="form__content">
                      <label htmlFor="code" className="form__content__label">Kod waluty (np. USD, CHF)</label><br/>
                      <input type="text" onChange={e => this.handleInputChange(e)} name="code" ref={ref => (this.input = ref)} className="form__content__input" autoFocus />
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
                      <SingleCurr key={i} currency={currency} code={code} rates={rates} deleteCurrency={this.deleteCurrency}/>
                    )
                  })  
                )
              : <div className="loading__spinner"></div>
            } 
        </div>
        <div className="footer">
          <p className="footer__text">&#10092; &#10093; with <span className="footer__heart">&#10084;</span> by <a href="https://github.com/anya92" target="_black">anya92</a></p>
        </div>
      </div>
    );
  }
}

export default App;
