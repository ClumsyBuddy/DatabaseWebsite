const io = require("./ServerGlobals").io;
const app = require("./ServerGlobals").app;
const SQLiteStore = require("./ServerGlobals").SQLiteStore;
const session = require("./ServerGlobals.js").session;
var DBClass;


function Init(){
    
    var Week = 7 * 24 * 60 * 60 * 1000;
    const SessionMiddleWare = session({
        store: new SQLiteStore,
        secret: 'DBSession',
        resave: true,
        saveUninitialized:true,
        cookie: { maxAge: Week } // 1 week
    });


    io.use(function(socket, next){
        SessionMiddleWare(socket.request, {}, next);
        //console.log("Helller");
    });

    app.use(SessionMiddleWare);


    io.on('connection', (socket) => {

        socket.on("init", async () => {
            //if(socket.request.session.PageData.ProductList.length == 0){
            //console.log(socket.request.session, "Init");
            socket.request.session.PageData.ProductList = await DBClass.GetAllProducts("Sable");
            socket.request.session.save();
            //console.log("Hello World");
            //}
            socket.emit("init", socket.request.session.PageData.ProductList);
        });
        
        
        socket.on('UpdatePList', async () => {
            //console.log(socket.request.session, "Update");
            socket.request.session.PageData.ProductList = await DBClass.GetAllProducts("Sable");
            socket.request.session.save();
        });
        
    
        socket.on('GetAdd', (msg) => {
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
        });
    
        socket.on('Delete', (msg) => {
            if(msg.Target.replace(" ", "") == "Sable"){
                const EmitMsg = async () => {
                    try{
                        //socket.request.session.PageData.Productlist = await Sable.DeleteItem(msg.Value);
                        //socket.request.session.save();
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
        });
    });
}

function on_connection(socket){

}


function ChangeClass(newClass){
    DBClass = newClass;
}



module.exports = {Init, ChangeClass};