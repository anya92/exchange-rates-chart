const axios = require('axios');

const getURL = code => {
  console.log('code', code);
  const baseUrl = 'http://api.nbp.pl/api/exchangerates/rates/a';

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  const lastDate = `${year}-${month}-${day}`;
  const firstDate = `${year - 1}-${month}-${day}`;

  const URL = `${baseUrl}/${code}/${firstDate}/${lastDate}/?format=json`;
  return URL;
}

module.exports = getURL;
