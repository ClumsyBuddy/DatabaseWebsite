"use strict";
exports.__esModule = true;
//Downloaded packages
var http = require('http');
var path = require('path');
var express = require('express');
var _Promise = require("bluebird");
//Create a app and router variable
var router = express.Router();
var app = express();
var render = require('ejs').render;
//My exported packages
var Database_1 = require("./Database");
var DatabaseManager_1 = require("./DatabaseManager");
var SableResponseHandler_1 = require("./Sable/SableResponseHandler");
//Create variables for exported Classes
var db = new Database_1.Database('./Main.db');
var SableDB = new DatabaseManager_1.DatabaseManager(db);
var HR = new SableResponseHandler_1.SableResponseHandler(SableDB);
//Create the main table
SableDB.createTable("Sable", "id TEXT, brand TEXT");
//Use Ejs for the view engine, We want to use templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Setup Json and URL parsing
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({
    extended: true
}));
// Setup all pathways for public folders
app.use(express.static(__dirname + '/public')); //Shows where static files are
app.use('/uploads', express.static(__dirname + '/public'));
app.use('/javascript', express.static(__dirname + '/public'));
app.use('/CSS', express.static(__dirname + '/public'));
var hostname = '192.168.1.123';
var port = 8000;
// Will be used to log activities
app.use(function (req, res, next) {
    // log each request to the console
    //var Message = `Method: ${req.method} || At: ${req.url} || IP: ${req.ip.split("ffff:").pop()}`
    //console.log(Message);
    // continue doing what we were doing and go to the route
    next();
});
//Router for getting all get and post request on '/' which is index
app.route('/')
    .get(function (req, res) {
    var Data = {
        Title: "DataBase",
        MenuState: { LoginState: "None" }
    };
    res.render('pages/index', { Data: Data });
}).post(function (req, res) {
});
app.use('/', router);
app.listen(port, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});
