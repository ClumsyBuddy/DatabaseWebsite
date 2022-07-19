//const server = require("./Sockets/ServerGlobals.js").server;
//const ip = require("./Sockets/ServerGlobals.js").ip;
//const Socket = require("./Sockets/ServerSocketHandler");
import {io, ip, server} from "./Sockets/ServerGlobals.js";
import {Init} from  "./Sockets/ServerSocketHandler.js";
import {RoutesInit} from "./Sockets/Routes.js"

const hostname = ip.address();
const port = 8000;
Init(); //Initalize Sockets
RoutesInit();
server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});