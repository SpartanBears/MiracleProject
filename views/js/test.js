'use strict'
var userSocket = io();

userSocket.emit('TEST randomChars', { names: ["Halian", "Vohadan", "Grizz"] });

userSocket.on('randomChars SUCCESS', function (data) {

    console.log(data.return);
});
