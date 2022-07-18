var express = require('express');
var ip = require('ip');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var app = express();
var http = require('http');
var server = http.createServer(app);
var Server = require("socket.io").Server;
var io = new Server(server);

app.set('views', "./Server/views");
app.set('view engine', 'ejs');
//Setup Json and URL parsing
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));

var Public = "./public";
app.use(express.static(Public));
app.use('/uploads', express.static(Public));
app.use('/javascript', express.static(Public));
app.use('/CSS', express.static(Public));

const {Database} = require("../Server/Database/Database.js");
const {DatabaseManager} = require("../Server/Database/DatabaseManager");
const {SableResponseHandler} = require("../Server/DBClasses/Sable/SableResponseHandler");
const {DiploResponseHandler} = require("../Server/DBClasses/Diplomat/DiploResponseHandler");
const {Login} = require("../Server/DBClasses/Login/LoginHandler");
const {IndexResponseHandler} = require("../Server/DBClasses/Index/IndexResponseHandler");

//Create variables for exported Classes
const db = new Database("./Main.db");
//Main Database
const MainDB = new DatabaseManager(db);
//Login Manager
const UserLogin = new Login(MainDB);

const Index = new IndexResponseHandler(MainDB, UserLogin, io);
const Sable = new SableResponseHandler(MainDB, UserLogin, "Sable", io);
const Diplo = new DiploResponseHandler(MainDB, UserLogin, io);

var Classes = {
    db:db,
    MainDB:MainDB,
    UserLogin:UserLogin,
    Index:Index,
    Sable:Sable,
    Diplo:Diplo
}


module.exports = {
    app: app,
    http: http,
    server: server,
    io: io,
    SQLiteStore: SQLiteStore,
    session: session,
    ip: ip,
    express: express,
    Classes:Classes
};
