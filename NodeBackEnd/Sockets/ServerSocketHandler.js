import {Classes, io} from "./ServerGlobals.js";

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
    socket.on("add_Item", (new_item, fn)=>{
        console.log(new_item);
        if(!new_item || !new_item.SKU || !new_item.Brand){
            fn({
                status:"ok",
                msg:"Missing Information"
            });
            return;
        }
        //Need to parse the item data into useable bits for the database, then add it a return the new item and send  it to the clients to update the productlist
        let all_Keys = Object.keys(new_item);
        let new_Item_Object = {};

        all_Keys.forEach((value, i) =>{
            if(new_item[value] !== false){
                new_Item_Object[value] = new_item[value];
            }
        })

        console.log(new_Item_Object);
        Classes.Sable.AddItem(new_Item_Object);
        io.emit("new_Item_Added", "Hello World!");
    });

}
