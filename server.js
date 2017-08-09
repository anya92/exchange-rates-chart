const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const axios = require('axios');
const getURL = require('./helpers');

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

io.on('connection', socket => {
  io.emit('initialData', initialData);
  socket.on('add', code => {
    getRatesData(socket, code);
  });
  socket.on('delete', code => {
    delete initialData[code];
    socket.broadcast.emit('afterDelete', code);
  })
});

const getRatesData = async (socket, code) => {
  try {
    const url = getURL(code.toUpperCase());
    const rates = await axios.get(url);
    initialData[code] = rates.data;
    let data = {};
    data[code] = rates.data;
    io.emit('afterAdd', data);
  } catch (error) {
    console.log('error', error.response.statusText);
    socket.emit('errorMessage', error.response.statusText);
  }
}

const getInitialData = async (code) => {
  try {
    const url = getURL(code);
    const rates = await axios.get(url);
    initialData = {};
    initialData[code] = rates.data;
    io.emit('initialData', initialData);
  } catch (error) {
    console.log(error);
  }
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


server.listen(port, () => {
  console.log(`Server listening on ${port}`);
  getInitialData('EUR');
  io.emit('initialData', initialData);
});
