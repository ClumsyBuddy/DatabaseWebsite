import {io, app, SQLiteStore, session, Classes} from "./ServerGlobals.js";
var DBClass;


export function Init(){
    
    io.on('connection', on_connection); //Create socket connections\
}

function on_connection(socket){
    console.log("Connection");

    socket.on("delete_item_server", (msg, callback) => {
        console.log(msg);
        callback({
            status: "ok"
        });
        socket.broadcast.emit("delete_item_client", msg);
    });



}


export function ChangeClass(req, res, newClass){
    req.session.DataBaseClass = newClass;
    req.session.save();
}