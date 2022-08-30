import {app, Classes, io} from "./ServerGlobals.js";


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
            req.session.save(function(){});
            req.sessionStore.all((err, _session) => {
                _session.forEach((item) => {
                    if(item.sid !== req.sessionID){
                        if(item.sess.username === req.session.username){ //TODO need to rethink how I approach the sessions and remembering login
                            //req.sessionStore.destroy(item.sid, ()=>{console.log("Destroying: " + item.sid);})
                            //isLogin = false;
                        }
                    }
                })
            });
            res.status(200).json(isLogin);
        });
    
    //Router for getting all get and post request on '/' which is index
    app.get("/ItemData", (req, res) => {
        //console.log("Calling ItemData", Classes.ReponseHandler.ItemData("Sable"), Classes.ReponseHandler.getBrands("Sable"));
        res.json({ItemData:Classes.ReponseHandler.ItemData("Sable"), Brand:Classes.ReponseHandler.getBrands("Sable")});
    });
    app.get("/FilterData", (req, res) => {
        res.json({ItemData:Classes.ReponseHandler.ItemData("Sable"), Brand:Classes.ReponseHandler.getBrands("Sable")});
    });

    app.post("/SpecificItemType", (req, res) => {
        let ItemData;
        Classes.ReponseHandler.ItemData("Sable").forEach((element, i) => {
            if(element.ItemType === req.body.type){
                ItemData = element;
            }
        })
        res.json(ItemData);
    });

    

    app.get("/ProductList", async (req, res) => {
        const ProductList = await Classes.ReponseHandler.GetAllProducts("Sable");
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