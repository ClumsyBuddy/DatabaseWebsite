import {io, app, SQLiteStore, session} from "./ServerGlobals.js";
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
        socket.request.session.PageData.ProductList = await DBClass.GetAllProducts(DBClass.Name);
        socket.request.session.save();
        socket.emit("init", socket.request.session.PageData.ProductList);
    });
    
    socket.on('UpdatePList', async () => {
        socket.request.session.PageData.ProductList = await DBClass.GetAllProducts(DBClass.Name);
        socket.request.session.save();
    });

    socket.on('GetAdd', (msg) => {GetAddItems(socket, msg)});

    socket.on('Delete', (msg) => {Delete(socket, msg)});
}

function GetAddItems(socket, msg){
    if(msg.Target == "Sable"){
        const EmitAddGet = async () =>{
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
    const EmitMsg = async () => {
        try{
            //DBClass.DeleteItem(msg.Value);
            //socket.request.session.PageData.ProductList = await DBClass.GetAllProducts(DBClass.Name);
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

function ChangeClass(newClass){
    DBClass = newClass;
}

export {Init, ChangeClass};