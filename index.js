//Downloaded packages
const http = require('http');
const path = require('path');
const express = require('express');
const Promise = require("bluebird");



//Create a app and router variable
const router = express.Router();
const app = express();

//My exported packages
const Database = require('./Database');
const Products = require("./Products");
const ResponseHandler = require('./GetResponse');


//Create variables for exported Classes
const db = new Database('./Main.db');
const _Products = new Products(db);
const HR = new ResponseHandler("index.html", _Products);


//Create the main table
_Products.createTable();

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
    var Message = `Method: ${req.method} || At: ${req.url} || IP: ${req.ip.split("ffff:").pop()}`
    console.log(Message);
    // continue doing what we were doing and go to the route
    next();
});

//Router for getting all get and post request on '/' which is index
app.route('/')
    .get(function(req, res){
        res.render('pages/index');
    }).post(function(req, res){
        
    });

//Router for getting all get and post request on '/Sable'
app.route('/Sable')
    .get(function(req, res){
        if(req.query._Search != '' && req.query._Search != undefined && req.query != {}){
            console.log(`Fining and Rendering By Id with query: ${req.query._Search}`);
            HR.FindById(req, res, req.query._Search);
         } else if(req.query.I_Product != '' && req.query.I_Product != undefined && req.query != {}){
            console.log(`Rendering By Id with query: ${req.query.I_Product}`);
            HR.RenderById(req, res, req.query.I_Product, true);
         }else if(req.query._CancelButton != undefined){
            console.log(`Render All after CancelButton`);
             HR.RenderAll(req, res);
         }else{
            console.log(`Render All`);
             HR.RenderAll(req, res);
         }
    })
    .post(function(req, res){
        console.log(req.body);
        HR.HandleSablePost(req, res);
    });

app.route('/Diplo')
    .get(function(req, res){
        displayProducts = [];
        res.render('pages/Diplomat', {
            DisplayTitle: "Welcome To Diplomat",
            displayProducts,
            _Action: '/diplo'
        })
    }).post(function(req, res){

    });


app.use('/', router);
app.use('/Sable', router);
app.use('/Diplo', router);

app.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});