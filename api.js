const axios = require('axios');

const getURL = code => {
  const tableA = ["THB","USD","AUD","HKD","CAD","NZD","SGD","EUR","HUF","CHF","GBP","UAH","JPY","CZK","DKK","ISK","NOK","SEK","HRK","RON","BGN","TRY","ILS","CLP","PHP","MXN","ZAR","BRL","MYR","RUB","IDR","INR","KRW","CNY","XDR"];

  const baseUrl = 'https://api.nbp.pl/api/exchangerates/rates';
  const table = tableA.includes(code) ? 'a' : 'b';
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  const lastDate = `${year}-${month}-${day}`;
  const firstDate = `${year - 1}-${month}-${day}`;

  const URL = `${baseUrl}/${table}/${code}/${firstDate}/${lastDate}/?format=json`;
  return URL;
}

module.exports = getURL;
