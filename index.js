const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const express = require('express');
const { response } = require('express');
const app = express();
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));
app.use(express.static(__dirname + '/public')); //Shows where static files are


function ResponseHandler(req, res){
    console.log('Request for ' + req.url + ' by method ' + req.method);
    var fileUrl;
    if (req.url == '/') fileUrl = '/' + FrontPage;
    else fileUrl = req.url;
    var filePath = path.resolve('./public' + fileUrl);
    const fileExt = path.extname(filePath);
    if (fileExt == '.html') {
        fs.exists(filePath, (exists) => {
            if (!exists) {
                filePath = path.resolve('./public/404.html');
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        });
    }
    else if (fileExt == '.css') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        fs.createReadStream(filePath).pipe(res);
    }
    else if (fileExt == '.js'){
        res.statusCode = 200;
        res.setHeader('Content-Type', "javascript")
        fs.createReadStream(filePath).pipe(res);
    }
    else {
        filePath = path.resolve('./public/404.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
    }
}
function HandlePost(req, res){
    let Message = req.body;
    console.log(Message.field1);
}


const hostname = '192.168.1.123';
const port = 8000;
const FrontPage = "index.html"



app.get('/', (req, res) => {
    ResponseHandler(req, res);
});
app.post('/', (req, res) => {
    HandlePost(req, res);
});


const server = http.createServer(app);

app.listen(port);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
