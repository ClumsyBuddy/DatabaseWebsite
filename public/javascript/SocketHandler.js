import * as shake from "./HandShake.js";

/*
*   This File is where all Sockets are to be recieved from the Server
*/


mySocket.on("AddItemData", (msg) => {
    shake.AddItemData(msg);
});


mySocket.on("UPL", function(msg){
    mySocket.emit("UpdatePList");
});


mySocket.on("Delete", function(msg){
    shake.DeleteItem(msg.Value);   
});


mySocket.on("Add", function(msg){
    //console.log(msg);
});


mySocket.on("init", function(msg){
    shake.InitializeProductList(msg);
});