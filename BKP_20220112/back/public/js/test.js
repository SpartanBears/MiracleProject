'use strict'
var userSocket = io();

userSocket.on('TEST firebaseInsert SUCCESS', function () {

    console.log("TEST firebaseInsert SUCCESS");
});

userSocket.on('TEST firebaseSelect SUCCESS', function (data) {

    console.log(data);
});

function testInsert(db, id, object){

	userSocket.emit('TEST firebaseInsert', { db:db, id:id, object:object});
}

function testSelect(db, id){

	userSocket.emit('TEST firebaseSelect', { db:db, id:id});
}
