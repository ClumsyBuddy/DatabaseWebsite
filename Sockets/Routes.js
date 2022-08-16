import {app, Classes} from "./ServerGlobals.js";
import {ChangeClass} from "./ServerSocketHandler.js"


function RoutesInit(){
    app.use(function(req, res, next) {
        /*
        *   If we are not at the index page or logging in check if we have the logged in cookie
        *   If we do not then Reset the CurrentRenderTarget Back to index and then Get Index
        *   Else we are logged in and we can go to what we were doing
        */
        if(req.url != "/Login" && req.url != "/" && !req.session.loggedin){
            res.redirect("/");             
        }else{
            next();
        }
        // log each request to the console
        //var Message = `Method: ${req.method} || At: ${req.url} || IP: ${req.ip.split("ffff:").pop()}`
        //console.log(Message);
        // continue doing what we were doing and go to the route
    });
    
    app.post("/Logout", (req, res) => {
        Classes.Index.Logout(req, res);
        res.redirect("/");
    });
    
    app.route('/Login')
        .get((req, res) =>{
        }).post((req, res) => {
            Classes.Index.Login(req, res);
        });
    
    //Router for getting all get and post request on '/' which is index
    app.route('/')
        .get(function(req, res){
            Classes.Index.RenderLogin(req, res);
        });
    
    app.route('/Sable')
        .get(function(req, res){
            ChangeClass(req, res, Classes.Sable.Name);
            Classes.Sable._Get(req, res);
        });
    
    app.route('/Diplomat')
    .get(function(req, res){
        Classes.Diplo._Get(req, res);
    }).post(function(req, res){
    
    });
    
    app.route('/DataBaseSelection')
    .get(function(req, res){
        Classes.Index._Get(req, res);
    });


    app.route("/*").get(function(req, res){
        res.sendFile(process.cwd() + '/public/404.html');
    }).post(function(req, res){
        res.sendFile(process.cwd() + '/public/404.html');
    });


}



export {RoutesInit};