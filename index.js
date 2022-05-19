const http = require('http');
const fs = require('fs');
const path = require('path');
const RHandler = require("./GetResponse")
const express = require('express');
const { response } = require('express');

const Promise = require("bluebird");
const Database = require('./Database');
const Products = require("./Products");
const ResponseHandler = require('./GetResponse');
const { render } = require('express/lib/response');

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


const hostname = '192.168.1.123';
const port = 8000;

const _products = {
    All: _Products.getAll()
}

app.get('/', (req, res) => {
    //HR.Start(req, res);
    res.render('pages/index');
});
app.get('/Sable', (req, res) => {
    //HR.Start(req, res);
    res.render('pages/Sable', {
        _products
    });
});


app.post('/Sable', (req, res) => {
    HR.HandleSablePost(req, res);
});


const server = http.createServer(app);

app.listen(port);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
