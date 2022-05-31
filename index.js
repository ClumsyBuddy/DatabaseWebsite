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
const Sable_Menu = require('./Sable/SableMenuFunction');
const ResponseHandler = require('./GetResponse');
const Account = require('./Accounts');
const MasterLogger = require('./MasterLogger');

const SableMenu = new Sable_Menu();
const BaseLog = new MasterLogger();

//Create variables for exported Classes
const db = new Database('./Main.db');
const acc = new Database('./Account.db');

const _Products = new Products(db, "products");
const _accounts = new Account(acc, "accounts");

const HR = new ResponseHandler("index.html", _Products, BaseLog);

//Create the main table
_Products.createTable();
_accounts.createTable();
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
        var PageData = { //Data bundle to send to render function
            Title: "Main Database", //Title for header at top of page
            PageToRender: "pages/index", //Location of the page
            _Action: "/",  //Tracked request 
            DisplayPopUp: false, //Display Popup menu
            ProductList: [], //Container for products to be displayed
            FindProducts: 0, //Determines whether to find by id or not
            Query: "", // Data to hold query                                             /*  NEED TO RENAME THESE, THE NAMING IS TERRIBLE AND ITS HARD TO TELL WHAT IT DOES  */
            MenuState:  {ListState:"BaseDisplay", PopUpState:"Start", LoginState:"None"},
        }
        if(req.query.open_login == "PL"){
            PageData.MenuState.LoginState = "Show";
        }
        res.render(PageData.PageToRender, {Data:PageData});
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
            ProductList: [], //Container for products to be displayed
            FindProducts: 0, //Determines whether to find by id or not
            Query: "", // Data to hold query                                             /*  NEED TO RENAME THESE, THE NAMING IS TERRIBLE AND ITS HARD TO TELL WHAT IT DOES  */
            MenuState:  {ListState:"BaseDisplay", PopUpState:"Start", LoginState:"None"},
            DisplayProductList: true,
            Color: undefined
        }

        if(req.query._Search != undefined && req.query._Search != ''){ //If the query is a search query then add this data
            PageData.FindProducts = SableMenu.lookUpTable.All;
            SableMenu.currentlySearch = true;
            PageData.Query = req.query._Search;
            PageData.MenuState.ListState = "Search";
         } else if(req.query.I_Product != undefined && req.query.I_Product != ''){ // If the query is a product query then add this data
            PageData.FindProducts = SableMenu.lookUpTable.All;
            PageData.Query = req.query.I_Product;
            PageData.MenuState.ListState = "BrandDisplay";
        }else if(req.query.E_Product != undefined && req.query.E_Product != ''){ // If the query is a product query then add this data
            PageData.FindProducts = SableMenu.lookUpTable.Brand;
            PageData.Query = req.query.E_Product;
            PageData.MenuState.ListState = "ColorDisplay";
        }else if(req.query._Add != undefined && req.query._Add != ''){
            PageData.DisplayPopUp = true;
            PageData.MenuState.PopUpState = "Add";
        }else if(req.query.C_Product != undefined && req.query.C_Product != ''){
            PageData.DisplayPopUp = true;
            PageData.FindProducts = SableMenu.lookUpTable.Color;
            PageData.MenuState.ListState = "PopUp";
            PageData.MenuState.PopUpState = "Edit";
            var Variables = req.query.C_Product.split(",");
            PageData.Query = Variables[0];
            PageData.Color = Variables[1];
        }
        HR.RenderAll(req, res, PageData, SableMenu); //Render the page
        })
    .post(function(req, res){
        HR.HandleSablePost(req, res);
    });

app.route('/Diplo')
    .get(function(req, res){
        var PageData = { //Data bundle to send to render function
            Title: "Welcome To Diplo", //Title for header at top of page
            PageToRender: "pages/Diplo", //Location of the page
            _Action: "/Diplo",  //Tracked request 
            DisplayPopUp: false, //Display Popup menu
            ProductList: [], //Container for products to be displayed
            FindProducts: 0, //Determines whether to find by id or not
            Query: "", // Data to hold query                                             /*  NEED TO RENAME THESE, THE NAMING IS TERRIBLE AND ITS HARD TO TELL WHAT IT DOES  */
            MenuState:  {ListState:"BaseDisplay", PopUpState:"Start", LoginState:"None"},
            DisplayProductList: true,
            Color: undefined
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