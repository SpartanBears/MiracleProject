'use strict';
var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    port = 54321,
    publicDir = express.static(`${__dirname}/views`),
    fs = require('file-system');

app.use(publicDir)
	.get('/', function (req, res) {
		res.sendFile(`${publicDir}/index.html`)
	}
);

http.listen(port, function() {
	console.log('Miracle Project version a1.0 - SPEARS')
});

var Engine = require("./engine/engine.js");
var Testing = require("./testing/testing.js");

io.on('connection', function (socket) {

	io.emit('connected', {mensaje:'CONNECTION SUCCESSFUL'});

	socket.on('TEST randomChars', function (data) {
		Testing.runTest("randomChars", data.names, io, socket.id);
	});
});


