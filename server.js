const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

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


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
