const http = require('http');
const path = require('path');
const express = require('express');

const Promise = require("bluebird");
const Database = require('./Database');
const Products = require("./Products");
const ResponseHandler = require('./GetResponse');

const db = new Database('./Main.db');
const _Products = new Products(db);
const HR = new ResponseHandler("index.html", _Products);

_Products.createTable();

const app = express();

app.set("view engine", "ejs");


app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));
app.use(express.static(__dirname + '/public')); //Shows where static files are
app.use('/uploads', express.static(__dirname + '/public'));
app.use('/javascript', express.static(__dirname + '/public'));
app.use('/CSS', express.static(__dirname + '/public'));

const hostname = '192.168.1.123';
const port = 8000;

app.get('/', (req, res) => {
    //HR.Start(req, res);
    res.render('pages/index');
});

app.get('/Sable', (req, res) => {
    if(req.query._Search != '' && req.query._Search != undefined && req.query != {}){
       HR.FindById(req, res, req.query._Search);
    } else if(req.query.I_Product != '' && req.query.I_Product != undefined && req.query != {}){
        HR.RenderById(req, res, req.query.I_Product, true);
    }else if(req.query._CancelButton != undefined){
        HR.RenderAll(req, res);
    }else{
        HR.RenderAll(req, res);
    }
});
app.get('/Diplo', (req, res) =>{
    displayProducts = [];
    res.render('pages/Diplomat', {
        DisplayTitle: "Welcome To Diplomat",
        displayProducts,
        _Action: '/diplo'
    })
});

app.post('/Sable', (req, res) => {
    HR.HandleSablePost(req, res);
});


const server = http.createServer(app);

app.listen(port);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
