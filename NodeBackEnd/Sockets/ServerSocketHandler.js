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

    socket.on("delete_item_server", (msg) => {
        console.log(msg);
        socket.broadcast.emit("delete_item_client", msg);
    });



}


export function ChangeClass(req, res, newClass){
    req.session.DataBaseClass = newClass;
    req.session.save();
}