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
const _Products = new Products(db, "products");
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

        var PageData = { //Data bundle to send to render function
            Title: "Welcome To Sable", //Title for header at top of page
            PageToRender: "pages/Sable", //Location of the page
            _Action: "/Sable",  //Tracked request 
            DisplayPopUp: false, //Display Popup menu
            displayProducts: [], //Container for products to be displayed
            DisplayProductEdit: false, //Displays menu to edit products attributes
            FindById: false, //Determines whether to find by id or not
            Query: "", // Data to hold query                                             /*  NEED TO RENAME THESE, THE NAMING IS TERRIBLE AND ITS HARD TO TELL WHAT IT DOES  */
            ProductSection: undefined,
            ProductDisplay: true, //Display base product
            _DisplayProducts: false,
            _BackGroundDisplay: true, //Displays green product display
            ProductMenuToEdit: false //Bad name for something that lets you click the base product then shows the corresponding products to the base that then lets you open its menu
        }
        if(req.query._Search != undefined && req.query._Search != ''){ //If the query is a search query then add this data

            PageData.FindById = true;
            PageData.Query = req.query._Search;

         } else if(req.query.I_Product != undefined && req.query.I_Product != ''){ // If the query is a product query then add this data
            PageData.DisplayPopUp = false;
            PageData.FindById = true;
            PageData.Query = req.query.I_Product;
            PageData.DisplayProductEdit = false;
            PageData._DisplayProducts = false;
            PageData._BackGroundDisplay = true;
            PageData.ProductMenuToEdit = true;
         }else if(req.query.E_Product != undefined && req.query.E_Product != ''){ // If the query is a product query then add this data
            PageData.DisplayPopUp = true;
            PageData.Query = req.query.E_Product;
            PageData.DisplayProductEdit = true;
            PageData.FindById = true;
            PageData._DisplayProducts = true;
         }
         HR.RenderAll(req, res, PageData); //Render the page
        })
    .post(function(req, res){
        HR.HandleSablePost(req, res);
    });

app.route('/Diplo')
    .get(function(req, res){
        var PageData = { //Data bundle to send to render function
            Title: "Welcome To Diplomat", //Title for header at top of page
            PageToRender: "pages/Diplomat", //Location of the page
            _Action: "/Diplo",  //Tracked request 
            DisplayPopUp: false, //Display Popup menu
            displayProducts: [], //Container for products to be displayed
            DisplayProductEdit: false, //Displays menu to edit products attributes
            FindById: false, //Determines whether to find by id or not
            Query: "", // Data to hold query                                             /*  NEED TO RENAME THESE, THE NAMING IS TERRIBLE AND ITS HARD TO TELL WHAT IT DOES  */
            ProductSection: undefined,
            ProductDisplay: true, //Display base product
            _DisplayProducts: false,
            _BackGroundDisplay: true //Displays green product display
        }
        displayProducts = [];
        res.render('pages/Diplomat', {
            Data: PageData
        })
    }).post(function(req, res){

    });

app.use('/', router);
app.use('/Sable', router);
app.use('/Diplo', router);

app.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});