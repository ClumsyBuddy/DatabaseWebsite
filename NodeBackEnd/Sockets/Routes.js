import {app, Classes, io} from "./ServerGlobals.js";
import {ChangeClass} from "./ServerSocketHandler.js"


function RoutesInit(){
    app.use(function(req, res, next) {

        // log each request to the console
        //var Message = `Method: ${req.method} || At: ${req.url} || IP: ${req.ip.split("ffff:").pop()}`
        //console.log(Message);
        // continue doing what we were doing and go to the route
        next();
    });


    var Counter = 0;
    setInterval(() => {
        Counter++;
        io.emit("Counter", "Time Since Server Restart: " + Counter);
    }, 1000);
    app.post("/Logout", (req, res) => {
        Classes.Index.Logout(req, res);
        res.redirect("/");
    });
    app.route('/Login')
        .get(async (req, res) =>{
        }).post(async (req, res) => {
            console.log(req.session.id);
            let isLogin = await Classes.UserLogin.LoginAttempt(req, res, req.body.name, req.body.password);
            console.log("Is password and username correct: " + isLogin);
            //console.log(req.session);
            res.status(200).json(isLogin);
        });
    
    //Router for getting all get and post request on '/' which is index
    app.get("/ItemData", async (req, res) => {
        res.json(Classes.Sable.ItemData);
    });
    app.get("/Test", async (req, res) => {
        const ProductList = await Classes.Sable.GetAllProducts("Sable");
        res.json(ProductList);
    }); 
    app.route("/*").get(function(req, res){
        res.sendFile(process.cwd() + '/public/404.html');
    }).post(function(req, res){
        res.sendFile(process.cwd() + '/public/404.html');
    });


}



export {RoutesInit};