const { Server } = require("socket.io");
const io = new Server();

io.on("connection", (socket) => {

    console.log("USER CONNECTED");

    socket.emit("CONNECTION_SUCCESSFUL", "Miracle Project Engine v1.0");
});

io.listen(54321);




