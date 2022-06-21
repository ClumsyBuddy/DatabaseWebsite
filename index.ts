//Downloaded packages
const express = require('express');
const ip = require('ip');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
//Create a app and router variable
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

//Create variables for exported Classes
const db = new Database('./Main.db');
//Main Database
const MainDB = new DatabaseManager(db);
//Login Manager
const UserLogin = new Login(MainDB);

const Index = new IndexResponseHandler(MainDB, UserLogin, io);
const Sable = new SableResponseHandler(MainDB, UserLogin, "Sable", io);
const Diplo = new DiploResponseHandler(MainDB, UserLogin, io);

const hostname = ip.address();
const port = 8000;

const SessionMiddleWare = session({
    store: new SQLiteStore,
    secret: 'DBSession',
    resave: true,
    saveUninitialized:true,
    cookie: { maxAge: Week } // 1 week
});

io.use(function(socket, next){
    SessionMiddleWare(socket.request, {}, next);
});

app.use(SessionMiddleWare);



//FIXME Need to fix Duplicate Products appearing in the productlist
io.on('connection', (socket) => {
    console.log(socket.request.session.PageData.ProductList);
    if(socket.request.session.PageData.ProductList.length == 0){
        console.log("Send Emit");
        var StartUp = async () => {
            var ProductList = await Sable.GetAllProducts("Sable");
            socket.request.session.PageData.ProductList = ProductList;
            socket.request.session.save();
            socket.emit("init", ProductList);
        }
        StartUp();
    }

    socket.on('Delete', (msg) => {
        if(msg.Target == "Sable"){
            const EmitMsg = async () => {
                try{
                var ProductList = await Sable.DeleteItem(msg.Value);
                socket.request.session.PageData.Productlist = ProductList;
                io.emit("Delete", ProductList);
                return true;
                }
                catch(e){
                    console.log(e);
                    return false;
                }
            }
            if(!EmitMsg()){
                console.log("Coudln't Emit Message: " + JSON.stringify(msg));
            }
        }
    });

    socket.on('Add', (msg) => {
        if(msg.Target == "Sable"){
            io.emit("Add", "Hello");
        }
    });
    
    socket.on('Update', (msg) => {
        console.log(`Get ${msg} - Update Others`);
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
            req.session.PageData.CurrentRenderTarget = "/";
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
        Sable.ReturnSearchResults(req, res, req.query.Sable, req.session.PageData);
    }
    if(req.query.Diplomat != undefined){
        Diplo.ReturnSearchResults(req, res, req.query.Diplomat, req.session.PageData);
    }
});

app.get("/Update", (req, res) => {
    if(req.query.Sable != undefined){
        console.log(req.query);
    }
    if(req.query.Diplomat != undefined){
        console.log(req.query);
    }
    res.redirect("back");
});

app.get("/AddItem", (req, res) => {
    if(req.query.Sable != undefined){
        console.log(req.query);
        Sable.MakeTestData(req, res);
    }
    if(req.query.Diplomat != undefined){
        console.log(req.query);
    }
    res.redirect("back");
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
        Index.RenderLogin(req, res);
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
    Index._Get(req, res);
}).post(function(req, res){

});

server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});