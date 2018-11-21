'use strict'
var userSocket = io();
var tempTS;

//creates random Adventurers (no persistance)
userSocket.emit('TEST randomChars', { names: ["Halian", "Vohadan", "Grizz"] });

userSocket.on('randomChars SUCCESS', function (data) {

    console.log(data.return);
});

//creates a new User
tempTS = new Date().getTime();

userSocket.emit('TEST createUser', {user:"login_user_"+tempTS, pwd:"pwd"+tempTS, username:"username_"+tempTS});

userSocket.on('createUser SUCCESS', function(data){

	console.log(data);
});


//creates new User and a new God associated with it
tempTS = new Date().getTime();

userSocket.emit('TEST createGod', {godName:"god_"+tempTS, desc:"desc_"+tempTS});

userSocket.on('createGod SUCCESS', function(data){

	console.log(data);
});

//creates a new familia, with a new god and user
tempTS = new Date().getTime();

userSocket.emit('TEST createFamilia', {familiaName:"familia_"+tempTS});

userSocket.on('createFamilia SUCCESS', function(data){

	console.log(data);
});

//creates new adventurers (persistant) in a new familia, with new god and user
tempTS = new Date().getTime();

userSocket.emit('TEST createAdventurers', {names:["Halian", "Vohadan", "Grizz"]});

userSocket.on('createFamilia SUCCESS', function(data){

	console.log(data);
});
