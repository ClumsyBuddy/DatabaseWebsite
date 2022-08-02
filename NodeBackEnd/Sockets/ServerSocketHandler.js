import {io} from "./ServerGlobals.js";

import { Socket } from "socket.io";

export function Init(){
    
    io.on('connection', on_connection); //Create socket connections\
}
/**
 * 
 * @param {Socket} socket 
 */
function on_connection(socket){
    const req = socket.request;
    socket.use((___, next) => {
        req.session.reload((err)=> {
            if(err){
                socket.disconnect();
            }else{
                next();
            }
        })
    })
    socket.on("delete_item_server", (msg, callback) => {
        console.log(msg);
        callback({
            status: "ok"
        });
        socket.broadcast.emit("delete_item_client", msg);
    });

    socket.on("is_login", (fn) => {
        let Login = false;
        if(req.session.isLogin !== undefined){
            Login = req.session.isLogin;
        }
        fn({
            status:"ok",
            isLogin:Login
        })
    })

}
