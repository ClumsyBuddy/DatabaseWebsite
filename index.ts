const app = require("./Sockets/ServerGlobals.js").app;
const server = require("./Sockets/ServerGlobals.js").server;
const ip = require("./Sockets/ServerGlobals.js").ip;
const express = require("./Sockets/ServerGlobals").express;
const SQLiteStore = require("./Sockets/ServerGlobals").SQLiteStore;
const session = require("./Sockets/ServerGlobals").session;
const io = require("./Sockets/ServerGlobals.js").io;
const Socket = require("./Sockets/ServerSocketHandler");


// Setup all pathways for public folders

const hostname = ip.address();
const port = 8000;

Socket.Init();

// Will be used to log activities
require("./Sockets/Routes")();

server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});