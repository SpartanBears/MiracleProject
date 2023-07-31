window.onload = function(){

    let loginButton = document.querySelector('#login_input_commit');
    
    loginButton.addEventListener('click', function(evt){

        socket.emit('LOGIN_ATTEMPT', {user:document.querySelector('#login_input_user').value, pass:document.querySelector('#login_input_pass').value, meta:navigator.userAgent});

    }, false);

    loginButton.disabled = true;

    let registerButton = document.querySelector('#register_input_commit');

    registerButton.addEventListener('click', function(evt){

        socket.emit('REGISTER_USER', {user:document.querySelector('#register_input_email').value, pass:document.querySelector('#register_input_pass').value, display_name:document.querySelector('#register_input_displayname').value, meta:navigator.userAgent});

    }, false);

    registerButton.disabled = true;
};

const socket = io("https://miracleproject.online");

socket.on("CONNECTION_SUCCESSFUL", (message) => {
    console.log(message);

    document.querySelector('#login_input_commit').disabled = false;
    document.querySelector('#register_input_commit').disabled = false;

    //socket.emit("PING", (new Date().getTime()));
});

/*socket.on("PONG", (message) => {

    //console.log(message.client, message.server, message.client-(new Date().getTime()));
    document.querySelector('#ping_count').innerHTML = (new Date().getTime())-message.client;


    socket.emit("PING", (new Date().getTime()));
});*/

socket.on("LOGIN_ATTEMPT_SUCCESS", (message) => {

    sessionStorage['sk'] = JSON.stringify(message);
});

socket.on("LOGIN_ATTEMPT_FAILURE", (message) => {

    console.log(message);
});

socket.on("CONTENT_INPUT", (message) => {

    let newScript = document.createElement("script");
    newScript.text = message;
    document.querySelector('#content').innerHTML = "";
    document.querySelector('#content').append(newScript);
});