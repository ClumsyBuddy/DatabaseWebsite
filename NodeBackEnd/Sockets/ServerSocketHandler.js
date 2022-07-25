import {io, app, SQLiteStore, session, Classes} from "./ServerGlobals.js";
var DBClass;


export function Init(){
    var Week = 7 * 24 * 60 * 60 * 1000; //How long session token will remain
    const SessionMiddleWare = session({ //Create session middleware
        store: new SQLiteStore,
        secret: 'DBSession',
        resave: false,
        saveUninitialized:true,
        cookie: { maxAge: Week } // 1 week
    });
    io.use(function(socket, next){SessionMiddleWare(socket.request, {}, next);});
    app.use(SessionMiddleWare); //Use middleware
    io.on('connection', on_connection); //Create socket connections\
}

function on_connection(socket){
    console.log("Connection");
    
    socket.on("init", ()=>{InitCall(socket);});
    
    socket.on('UpdatePList', async () => {
        socket.request.session.PageData.ProductList = await Classes[socket.request.session.DataBaseClass].GetAllProducts(Classes[socket.request.session.DataBaseClass].Name);
        socket.request.session.save();
    });

    socket.on('GetAdd', (msg) => {GetAddItems(socket, msg)});

    socket.on('Delete', (msg) => {Delete(socket, msg)});


    socket.on("Search", async (msg) => {
        let pList = await Classes[socket.request.session.DataBaseClass].ReturnSearchResults(msg);
        if(pList.length > 0){
            socket.emit("init", pList);
        }else{
            InitCall(socket);
        }
    });
}

async function InitCall(socket){
    console.log("InitCall");
    socket.request.session.PageData.ProductList = await Classes[socket.request.session.DataBaseClass].GetAllProducts(Classes[socket.request.session.DataBaseClass].Name);
    socket.request.session.save();
    socket.emit("init", socket.request.session.PageData.ProductList);
}


function GetAddItems(socket, msg){
    if(msg.Target == "Sable"){
        const EmitAddGet = async () =>{
            socket.emit("AddItemData", {ItemData:Classes[socket.request.session.DataBaseClass].ItemData, Brands:Classes[socket.request.session.DataBaseClass].Brands});
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

export function ChangeClass(req, res, newClass){
    req.session.DataBaseClass = newClass;
    req.session.save();
}