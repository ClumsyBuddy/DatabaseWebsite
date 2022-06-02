//Downloaded packages
const path = require('path');
const express = require('express');

//Create a app and router variable
const router = express.Router();
const app = express();

//My exported packages
import {Database} from "./Database";
import {DatabaseManager} from "./DatabaseManager";
import {SableResponseHandler} from "./Sable/SableResponseHandler"
import { DiploResponseHandler } from "./Diplomat/DiploResponseHandler";

//Create variables for exported Classes
const db = new Database('./Main.db');
const MainDB = new DatabaseManager(db);
const Sable = new SableResponseHandler(MainDB);
const Diplo = new DiploResponseHandler(MainDB);
//Create the main table
Sable.DBController.createTable("Sable", "id TEXT, brand TEXT");
Diplo.DBController.createTable


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

const hostname = '192.168.1.123';
const port = 8000;

// Will be used to log activities
app.use(function(req, res, next) {
    // log each request to the console
    //var Message = `Method: ${req.method} || At: ${req.url} || IP: ${req.ip.split("ffff:").pop()}`
    //console.log(Message);
    // continue doing what we were doing and go to the route
    next();
});

//Router for getting all get and post request on '/' which is index
app.route('/')
    .get(function(req, res){
        var Data = {
           Title:"DataBase",
           MenuState:{LoginState:"None"}
        }
        res.render('pages/index', {Data});
    }).post(function(req, res){
        
    });


app.route('/Sable')
    .get(function(req, res){
        var Data = {
            Title:"DataBase",
            MenuState:{LoginState:"None"},
            ProductList: [],
            _Action: "/Sable"
         }
         res.render('pages/Sable', {Data});
    }).post(function(req, res){
        console.log(req.body);
        (success) => res.send(success);
    });



app.use('/', router);
app.use('/Sable', router);


app.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});