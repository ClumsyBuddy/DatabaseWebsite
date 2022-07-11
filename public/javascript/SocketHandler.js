import * as lib from '../javascript/Main.js';
import { InfoBlock } from './HtmlBuilder.js';
import { FNavCloseButtonListener } from './HtmlBuilder.js';

var ItemData = undefined;
mySocket.on("AddItemData", (msg) => {
    if(msg == undefined){
        throw console.error("ItemData not returned from server");
    }
    FNavCloseButtonListener();
    ItemData = msg;
    document.getElementById("FullNav").style.width = "100%";
    var Overlay_Content = document.getElementById("OVC");
    document.getElementById("OVT").textContent = "Select ItemType";
    var ItemTypeArray = [];
    for(let  i = 0; i < msg.length; i++){
        ItemTypeArray.push(InfoBlock(msg[i]));
        Overlay_Content.appendChild(ItemTypeArray[i]);
    }
});

mySocket.on("UPL", function(msg){
    mySocket.emit("UpdatePList");
});
mySocket.on("Delete", function(msg){ //TODO Recieve whether delete succeeded and if it did then remove the item and possibly rebuild?
    lib.DeleteItem(msg.Value);        
});
mySocket.on("Add", function(msg){
    //console.log(msg);
});
mySocket.on("init", function(msg){
    console.log("First");
    lib.FirstBuild(msg);
    lib.AddScrollEvent();
});