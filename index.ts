//Downloaded packages
const path = require('path');
const express = require('express');
const ip = require('ip');
const session = require('express-session');
//Create a app and router variable
const router = express.Router();
const app = express();

app.use(session({
    secret:"secret",
    resave:true,
    saveUnitialized:true
}));

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

const Index = new IndexResponseHandler(MainDB, UserLogin, app);
const Sable = new SableResponseHandler(MainDB, UserLogin);
const Diplo = new DiploResponseHandler(MainDB, UserLogin);


//Use Ejs for the view engine, We want to use templates
app.set("view engine", "ejs");


//Setup Json and URL parsing
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));

// Setup all pathways for public folders
app.use(express.static(__dirname + '/public')); //Shows where static files are
app.use('/uploads', express.static(__dirname + '/public'));
app.use('/javascript', express.static(__dirname + '/public'));
app.use('/CSS', express.static(__dirname + '/public'));

const hostname = ip.address();
const port = 8000;

// Will be used to log activities
app.use(function(req, res, next) {
    // log each request to the console
    //var Message = `Method: ${req.method} || At: ${req.url} || IP: ${req.ip.split("ffff:").pop()}`
    //console.log(Message);
    // continue doing what we were doing and go to the route
    next();
});

app.post("/Logout", (req, res) => {
    Index.Logout(req, res);
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

app.route('/Sable')
    .get(function(req, res){
        Sable._Get(req, res, Sable.GetAllProducts.bind(Sable));
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

app.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});