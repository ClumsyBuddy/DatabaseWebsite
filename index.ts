const server = require("./Sockets/ServerGlobals.js").server;
const ip = require("./Sockets/ServerGlobals.js").ip;
const Socket = require("./Sockets/ServerSocketHandler");

const hostname = ip.address();
const port = 8000;
Socket.Init(); //Initalize Sockets
require("./Sockets/Routes")(); //Initialize Express Routes
server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});