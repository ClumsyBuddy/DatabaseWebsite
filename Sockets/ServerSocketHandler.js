const io = require("./ServerGlobals").io;
const app = require("./ServerGlobals").app;
const SQLiteStore = require("./ServerGlobals").SQLiteStore;
const session = require("./ServerGlobals.js").session;
var DBClass;


function Init(){
    
    var Week = 7 * 24 * 60 * 60 * 1000; //How long session token will remain
    const SessionMiddleWare = session({ //Create session middleware
        store: new SQLiteStore,
        secret: 'DBSession',
        resave: true,
        saveUninitialized:true,
        cookie: { maxAge: Week } // 1 week
    });
    io.use(function(socket, next){SessionMiddleWare(socket.request, {}, next);});
    app.use(SessionMiddleWare); //Use middleware

    io.on('connection', on_connection); //Create socket connections
}

function on_connection(socket){

    socket.on("init", async () => {
        socket.request.session.PageData.ProductList = await DBClass.GetAllProducts("Sable");
        socket.request.session.save();
        socket.emit("init", socket.request.session.PageData.ProductList);
    });
    
    socket.on('UpdatePList', async () => {
        socket.request.session.PageData.ProductList = await DBClass.GetAllProducts("Sable");
        socket.request.session.save();
    });

    socket.on('GetAdd', (msg) => {GetAddItems(socket, msg)});

    socket.on('Delete', (msg) => {Delete(socket, msg)});
}



function GetAddItems(socket, msg){
    if(msg.Target == "Sable"){
        const EmitAddGet = async () =>{
            console.log("Sending Item Data");
            socket.emit("AddItemData", {ItemData:DBClass.ItemData, Brands:DBClass.Brands});
        }
        try{
            EmitAddGet();
        }catch(e){
            console.log("Error Occurred: " + e);
        }
    }
}

function Delete(socket, msg){
    if(msg.Target.replace(" ", "") == "Sable"){
        const EmitMsg = async () => {
            try{
                io.emit("Delete", {Response:true, Value:msg.Value});
                socket.emit("UPL");
                return true;
            }
            catch(e){
                console.log(e);
                return false;
            }
        }
        if(!EmitMsg()){
            console.log("Coudln't Emit Message: " + JSON.stringify(msg));
        }
    }
}



function ChangeClass(newClass){
    DBClass = newClass;
}



module.exports = {Init, ChangeClass};