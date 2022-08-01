import {io} from "./ServerGlobals.js";

export function Init(){
    
    io.on('connection', on_connection); //Create socket connections\
}

function on_connection(socket){
    const session = socket.request.session;

    socket.on("delete_item_server", (msg, callback) => {
        console.log(msg);
        callback({
            status: "ok"
        });
        socket.broadcast.emit("delete_item_client", msg);
    });

    socket.on("is_login", (fn) => {
        let Login = false;
        if(session.isLogin !== undefined){
            Login = session.isLogin;
        }
        fn({
            status:"ok",
            IsLogin:Login
        })
    })

}
