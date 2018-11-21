'use strict'
var userSocket = io();

userSocket.emit('TEST randomChars', { names: ["Halian", "Vohadan", "Grizz"] });

userSocket.on('randomChars SUCCESS', function (data) {

    console.log(data.return);
});

var tempTS = new Date().getTime();

userSocket.emit('TEST createUser', {user:"login_user_"+tempTS, pwd:"pwd"+tempTS, username:"username_"+tempTS});

userSocket.on('createUser SUCCESS', function(data){

	console.log(data);
});
