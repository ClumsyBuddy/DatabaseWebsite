import {app, Classes, io, MemoryStore} from "./ServerGlobals.js";
import upload from "./upload.js";
import { Blah } from "./HandleUpload.js";

import * as fs from "fs";
import { parse } from "csv-parse";

var Counter = 0;
setInterval(() => {
    Counter++;
    io.emit("Counter", "Time Since Server Restart: " + Counter);
}, 1000);

    
function RoutesInit(){
    app.use(function(req, res, next) {
        // log each request to the console
        var Message = `Method: ${req.method} || At: ${req.url} || IP: ${req.ip.split("ffff:").pop()} || Server Timer: ${Counter}`
        console.log(Message);
        
        next();
    });


    app.route("/is_login")
    .post((req, res)=>{
        if(req.session.username !== undefined && req.session.isLogin !== undefined){
            console.log(req.session.username, req.session.isLogin);
            res.status(200).json({user:req.session.username, login:req.session.isLogin});
        }else{
            res.status(200).json({user:"", login:false});
        }
    });

    app.post("/Logout", (req, res) => {

    });
    app.route('/Login')
        .get(async (req, res) =>{
        }).post(async (req, res) => {
            let isLogin = await Classes.UserLogin.LoginAttempt(req, res, req.body.name, req.body.password);
            req.sessionStore.all((e, o) => {console.log(o)});
            // req.session.save();
            res.status(200).json(isLogin);
        });
    
    //Router for getting all get and post request on '/' which is index
    app.get("/ItemData", (req, res) => {
        //console.log("Calling ItemData", Classes.ResponseHandler.ItemData("Sable"), Classes.ResponseHandler.getBrands("Sable"));
        res.json({ItemData:Classes.ResponseHandler.ItemData("Sable"), Brand:Classes.ResponseHandler.getBrands("Sable")});
    });
    app.get("/FilterData", (req, res) => {
        res.json({ItemData:Classes.ResponseHandler.ItemData("Sable"), Brand:Classes.ResponseHandler.getBrands("Sable")});
    });

    app.post("/ImportFile", upload,  (req, res, next) => {
        const file = req.file;
        console.log(file, "Hello World");
        if(!file){
            const error = new Error("No File");
            error.httpStatusCode = 400;
            return next(error);
        }
        

        var RowArray = [];
        var  OpenFile = fs.createReadStream(file.path)
        .pipe(parse(
            { delimiter: ",",
            columns: true, 
            // to_line:400, 
            skip_empty_lines:true,
            }
        )).on("data", function (row) {
            var RowObject = {
                SKU:row["Handle"],
                Tags:row["Tags"],
                VSKU:row["Variant SKU"],
                Status:row["Status"],
                ImageAlt:row["Image Alt Text"]
            }
            RowArray.push(RowObject);
            // console.log(RowArray);
        }).on("end", function() {
            Blah(RowArray);
            console.log("Finished");
        }).on("close", function() {
            OpenFile.destroy();   
            fs.unlink(file.path, () => {
                console.log("Deleted upload");
            })
        });


        res.json("Hello World");
    });


    app.post("/SpecificItemType", (req, res) => {
        let ItemData;
        Classes.ResponseHandler.ItemData("Sable").forEach((element, i) => {
            if(element.ItemType === req.body.type){
                ItemData = element;
            }
        })
        res.json(ItemData);
    });

    

    app.get("/ProductList", async (req, res) => {
        const ProductList = await Classes.ResponseHandler.GetAllProducts("Sable");
        console.log(req.session.isLogin);
        res.json(ProductList);
    }); 
    
    app.route("/*").get(function(req, res){
        res.status(404).json("GET Route Not Found");
    }).post(function(req, res){
        res.status(404).json("POST Route Not Found");
    });
}



export {RoutesInit};