'use strict';

var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    port = 54321,
    publicDir = express.static(`${__dirname}/public`);

app.use(publicDir)
	.get('/', function (req, res) {
		res.sendFile(`${publicDir}/index.html`)
	}
);

http.listen(port, function() {
	console.log('Miracle Project version a1.0 - SPEARS')
});

var firebase = require('firebase-admin');

var serviceAccount = require("./spears-miracleproject-firebase-adminsdk-l5c5z-dfc4f25d9a.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://spears-miracleproject.firebaseio.com'
});

function insertTest(db, id, object){

	return firebase.database().ref('/'+db+'/'+id).set(object);
}

function selectTest(db, id){

	return firebase.database().ref('/'+db+'/' + id).once('value');
}

function deleteTest(db, id){

	firebase.database().ref('/'+db+'/' + id).delete();
}

//SOCKET LISTENERS
io.on('connection', function (socket) {

	io.to(socket.id).emit('connected', {mensaje:'CONNECTION SUCCESSFUL'});

	socket.on('TEST firebaseInsert', function (data) {

		insertTest(data.db, data.id, data.object).then(function(){

			io.to(socket.id).emit("TEST firebaseInsert SUCCESS");
		});
	});

	socket.on('TEST firebaseSelect', function (data) {
		
		selectTest(data.db, data.id).then(function(res){

			io.to(socket.id).emit("TEST firebaseSelect SUCCESS", res);
		});
	});

	socket.on('TEST firebaseDelete', function (data) {
		
	});
});