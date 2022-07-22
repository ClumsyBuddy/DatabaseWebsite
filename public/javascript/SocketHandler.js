import * as shake from "./HandShake.js";


export var mySocket = io.connect();
mySocket.emit("init");




mySocket.on("init", function(msg){
    console.log("Get Server Init");
    shake.InitializeProductList(msg);
});

mySocket.on("AddItemData", (msg) => {
    console.log("AddItem");
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




mySocket.on("connet_error", (err) => {
    console.log(err);
});

mySocket.on('connect_timeout', function(err) {
    console.log("client connect_timeout: ", err);
});