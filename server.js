const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const axios = require('axios');
// const CronJob = require('cron').CronJob;
const getURL = require('./api');

const app = express();
const port = process.env.PORT || 8080;

// serve static files from the react app
app.use(express.static(path.join(__dirname, 'client/build')));

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  console.log('New client connected.');
  socket.on('disconnect', () => console.log('Client disconnected.'));
});

let initialData = {};

const getDataEveryDay = async (code) => {
  try {
    const url = getURL(code);
    const rates = await axios.get(url);
    initialData = {};
    initialData[code] = rates.data;
    initialData[code].id = Math.round(Math.random() * 1000);
    io.emit('currData', initialData);
  } catch (error) {
    console.log(error);
  }
}

io.on('connection', socket => {
  io.emit('initialData', initialData);
  socket.on('addCurr', code => {
    getRatesData(socket, code);
  });
  socket.on('deleteCode', code => {
    console.log('initialData', initialData);
    console.log('delete', code);
    delete initialData[code];
    console.log('initialData', initialData);
    io.emit('initialData', initialData);
  })
});

const getRatesData = async (socket, code) => {
  try {
    const url = getURL(code);
    const rates = await axios.get(url);
    initialData[code] = (rates.data);
    io.emit('currData', initialData);
  } catch (error) {
    console.log('error', error.response.statusText);
    socket.emit('errorMessage', error.response.statusText);
  }
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// new CronJob('00 11 13 * * *', function() {
//   // Runs every day at 9:00:00
//   console.log('Get new data at 9:00');
//   getDataEveryDay('EUR');
// }, null, true, 'Europe/Warsaw');


server.listen(port, () => {
  console.log(`Server listening on ${port}`);
  getDataEveryDay('EUR');
  io.emit('initialData', initialData);
});
