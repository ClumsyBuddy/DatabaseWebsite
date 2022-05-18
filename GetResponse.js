const fs = require('fs');
const path = require('path');

class  ResponseHandler{
    constructor(MainIndex, PControl){
        this.FrontPage = MainIndex;
        this.PControl = PControl;
        this.Test = "Hey Arnold";
    }

    Start(req, res){
        console.log('Request for ' + req.url + ' by method ' + req.method);
        var fileUrl;
        if (req.url == '/') fileUrl = '/' +  this.FrontPage;
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

    SillyCallbackFunction(result){
        console.log(result);
        console.log(this.Test);
    }


    HandlePost(req, res){
        var postMessage = req.body;
        switch(postMessage._Search){
            case 'duh':
                console.log("Le meme");
                this.PControl.getById("SMK110").then(this.SillyCallbackFunction.bind(this));
                break;
            case 'lol':
                console.log("SCREEEE");
                break;
        }
    }

}


module.exports = ResponseHandler