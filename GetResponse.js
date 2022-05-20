const fs = require('fs');
const path = require('path');
const { off } = require('process');

class  ResponseHandler{
    constructor(MainIndex, PControl){
        this.FrontPage = MainIndex;
        this.PControl = PControl;
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
                    res.render(filePath);
                    //fs.createReadStream(filePath).pipe(res);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.render(filePath);
                //fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.css') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/css');
            res.render(filePath);
            //fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.js'){
            res.statusCode = 200;
            res.setHeader('Content-Type', "javascript")
            res.render(filePath);
            //fs.createReadStream(filePath).pipe(res);
        }
        else {
            filePath = path.resolve('./public/404.html');
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.render(filePath);
            //fs.createReadStream(filePath).pipe(res);
        }
    }

    RenderAll(req, res){
        this.PControl.getAll().then((result) => {
            var ItemArray = [];
            ItemArray = result;
            res.render('pages/Sable', {
                DisplayTitle: "Welcome To Sable",
                displayProducts: ItemArray,
                _Action: '/Sable',
                DisplayPopUp: false
            });
        })
    }
    
    FindById(req, res, query){
        this.PControl.getAll().then((result) =>{
            var ItemArray = [];
            for(var _node in result){
                if(result[_node].id.includes(query)){
                    ItemArray.push(result[_node]);
                }
            }
            res.render('pages/Sable', {
                DisplayTitle: "Welcome To Sable",
                displayProducts: ItemArray,
                _Action: '/Sable',
                DisplayPopUp: false
            });
        })  
    }

    RenderById(req, res, query, DisplayPopUp = false){
        this.PControl.getById(query).then((result) =>{
            if(result == undefined){
                this.RenderAll(req, res);
                return;
            }
            var ItemArray = [];
            if(Array.isArray(result) == false){
                ItemArray.push(result);
            }else{
                ItemArray = result;
            }
            res.render('pages/Sable', {
                DisplayTitle: "Welcome To Sable",
                displayProducts: ItemArray,
                _Action: '/Sable',
                DisplayPopUp: DisplayPopUp
            });
        })
    }

    HandleSablePost(req, res){
        var postMessage = req.body;
        if(postMessage._ID != undefined & postMessage._NAME != undefined){
            console.log("Adding: " + postMessage._ID + " " + postMessage._NAME);
            this.PControl.create(postMessage._ID, postMessage._NAME);
            res.redirect(req.get("referer"));
            postMessage._ID = undefined;
        }

        if(postMessage._Delete != undefined){
            console.log("Deleting: " + postMessage._Delete);
            this.PControl.delete(postMessage._Delete);
            res.redirect(req.get("referer"));
            postMessage._Delete = undefined;
        }
    }

}


module.exports = ResponseHandler