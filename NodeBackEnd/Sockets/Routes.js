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


    app.post("/Logout", (req, res) => {

    });
    app.route('/Login')
        .get(async (req, res) =>{
        }).post(async (req, res) => {
            let isLogin = await Classes.UserLogin.LoginAttempt(req, res, req.body.name, req.body.password);
            req.session.save(function(){});
           /* req.sessionStore.all((err, _session) => {
                _session.forEach((item) => {
                    if(item.sid !== req.sessionID){
                        if(item.sess.username === req.session.username){
                            req.sessionStore.destroy(item.sid, ()=>{console.log("Destroying: " + item.sid);})
                        }
                    }
                })
            }); */
            res.status(200).json(isLogin);
        });
    
    //Router for getting all get and post request on '/' which is index
    app.get("/ItemData", (req, res) => {
        res.json(Classes.Sable.ItemData);
    });

    app.get("/ProductList", async (req, res) => {
        const ProductList = await Classes.Sable.GetAllProducts("Sable");
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