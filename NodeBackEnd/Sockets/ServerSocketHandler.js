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
    socket.on("delete_item_server", async (msg, callback) => {
        let status = await Classes.ResponseHandler.DeleteItem("Sable", Number(msg.key))
        if(!status){
            callback({
                status: "failed",
                msg:"Could not delete item"
            });
            return;
        }
        callback({
            status: "ok",
            msg:"Deleted item successfully"
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
        });
    });
    socket.on("add_Item", (new_item, fn)=>{
        //Check if missing SKU or Brand, send response saying fail
        if(!new_item || !new_item.sku || !new_item.brand || new_item.active === undefined){
            fn({ //This is the callback function that the Socket sends
                status:"failed",
                msg:"Missing Information"
            });
            console.log("Missing SKU or Brand");
            return;
        }
        console.log(new_item);
        let all_Keys = Object.keys(new_item); //All keys in string format
        let new_Item_Object = {}; //This will hold all Options and option values in pairs

        all_Keys.forEach((value, i) =>{
            if(new_item[value] !== false || value === "active"){ //We only add selected items that are true to the new object
                new_Item_Object[value] = new_item[value];
            }
        });
        Classes.ResponseHandler.AddItem(new_Item_Object, "Sable").then(async (result) => {
            if(result.ItemAlreadyExist){ //If the item already exist then we can skip to the next one
                fn({
                    status:"duplicate"
                });
                return;
            }
            fn({ //Return Response that it was successful
                status:"success",
            })
            io.emit("new_Item_Added", await Classes.ResponseHandler.GetItemById("Sable", result.id)); //Emit the new item to all clients
        });
    });

    socket.on("update_item", async (itemToUpdate, fn) => {
        console.log(itemToUpdate);
        if(!itemToUpdate.updated){
            fn({
                status:"failed"
            });
            console.log("ERROR NO ITEMS: update_item");
            return;
        }
        const ValuesToUpdate = Object.keys(itemToUpdate.updated);
        let options_Values = [];
        ValuesToUpdate.forEach((val) => {
            if(typeof itemToUpdate.updated[val] === "string"){
                if(itemToUpdate.updated[val][itemToUpdate.updated[val].length-1] === ","){
                    itemToUpdate.updated[val] = itemToUpdate.updated[val].slice(0, itemToUpdate.updated[val].length-1);
                }
                if(itemToUpdate.updated[val][0] === ","){
                    itemToUpdate.updated[val] = itemToUpdate.updated[val].substring(1);
                }
                options_Values.push(itemToUpdate.updated[val]);
            }else{
                options_Values.push(itemToUpdate.updated[val]);
            }
        });
        const ItemKey = itemToUpdate.key;

        Classes.ResponseHandler.UpdateItem(ValuesToUpdate, options_Values, ItemKey, "Sable").then((result) => {
            fn({
                status:"success"
            });
            io.emit("client_updated_item", result);
        });


    });
    socket.on("disconnect", function(req) {
        console.log(socket.request);
    });

}
