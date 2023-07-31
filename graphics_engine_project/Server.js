const express 	= require('express');
const app 		= express();
const http 		= require('http').Server(app);
const io 		= require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ' + __dirname);
});