//Downloaded packages
const path = require('path');
const express = require('express');
const ip = require('ip');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
//Create a app and router variable
const router = express.Router();
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


// Setup all pathways for public folders
app.use(express.static(__dirname + '/public')); //Shows where static files are

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//Setup Json and URL parsing
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));
var Week = 7 * 24 * 60 * 60 * 1000;
app.use(session({
    store: new SQLiteStore,
    secret: 'DBSession',
    cookie: { maxAge: Week } // 1 week
}));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/public'));
app.use('/javascript', express.static(__dirname + '/public'));
app.use('/CSS', express.static(__dirname + '/public'));

//My exported packages
import {Database} from "./Database";
import {DatabaseManager} from "./DatabaseManager";
import {SableResponseHandler} from "./Sable/SableResponseHandler"
import { DiploResponseHandler } from "./Diplomat/DiploResponseHandler";
import { Login } from "./LoginHandler";
import { IndexResponseHandler } from "./IndexResponseHandler";
import { Socket } from "socket.io";

//Create variables for exported Classes
const db = new Database('./Main.db');
//Main Database
const MainDB = new DatabaseManager(db);
//Login Manager
const UserLogin = new Login(MainDB);

const Index = new IndexResponseHandler(MainDB, UserLogin, app);
const Sable = new SableResponseHandler(MainDB, UserLogin);
const Diplo = new DiploResponseHandler(MainDB, UserLogin);

const hostname = ip.address();
const port = 8000;



io.on('connection', (socket) => {
    console.log('a user connected');
  });


io.on('Delete', (socket) => {
    socket.on('Delete', (msg) => {

    });
});

io.on('Add', (socket) => {
    socket.on('Add', (msg) => {

    });
});
io.on('Update', (socket) => {
    socket.on('Update', (msg) => {

    });
});


// Will be used to log activities
app.use(function(req, res, next) {

    /*
    *   If we are not at the index page or logging in check if we have the logged in cookie
    *   If we do not then Reset the CurrentRenderTarget Back to index and then Get Index
    *   Else we are logged in and we can go to what we were doing
    */
    if(req.url != "/Login" && req.url != "/" && !LoginCheck(req, res)){
            Index.ResetPageState("CurrentRenderTarget");
            Index._Get(req, res, "/");
    }else{
        next();
    }
    // log each request to the console
    //var Message = `Method: ${req.method} || At: ${req.url} || IP: ${req.ip.split("ffff:").pop()}`
    //console.log(Message);
    // continue doing what we were doing and go to the route
    
});

var LoginCheck = (req, res) => {
    if(req.session.loggedin == true){
        return true;
    }
    return false;
}


app.post("/Logout", (req, res) => {
    Index.Logout(req, res);
});

app.get("/Search", (req, res) => {
    if(req.query.Sable != undefined){
        Sable.ReturnSearchResults(req, res, req.query.Sable, Sable.PageData);
    }
    if(req.query.Diplomat != undefined){
        Diplo.ReturnSearchResults(req, res, req.query.Diplomat, Diplo.PageData);
    }
});


app.get("/AddItem", (req, res) => {
    if(req.query.Sable != undefined){
        console.log(req.query);
    }
    if(req.query.Diplomat != undefined){
        console.log(req.query);
    }
});

app.route('/Login')
    .get((req, res) =>{
        Index.Login(req, res);
    }).post((req, res) => {
        Index.Login(req, res);
    });

//Router for getting all get and post request on '/' which is index
app.route('/')
    .get(function(req, res){
        Index._Get(req, res);
    }).post(function(req, res){
        Index._Post(req, res);
    });

app.route("/Delete").post(function(req, res){
    if(req.body.Sable){
        Sable.DeleteItem(req, res, req.body.Sable, Sable.PageData);
    }
    if(req.body.Diplomat){

    }
});

app.route('/Sable')
    .get(function(req, res){
        Sable.Start(req, res);
    }).post(function(req, res){
        console.log(req.body);
        (success) => res.send(success);
    });

app.route('/Diplomat')
.get(function(req, res){
        Diplo._Get(req, res);
}).post(function(req, res){

});

app.route('/DataBaseSelection')
.get(function(req, res){
    Index._Get(req, res, "DataBaseSelection");
}).post(function(req, res){

});

server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});