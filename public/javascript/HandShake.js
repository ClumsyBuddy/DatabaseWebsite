import * as lib from "./Main.js";
import * as Add from "./AddItem.js";
/*
*   This File contains the "MiddleWare" for all Socket client calls. Using this we can log, change or check for errors
*   before and after any function calls without bloating the SocketHandler with code. This also allows us
*   to check for errors alot better as we can try catch and return the errors without bloating the Main Code
*/

export function InitializeProductList(ProductList){
    lib.FirstBuild(ProductList);
}


export function AddItemData(msg){
    if(msg == undefined){
        throw console.error("ItemData not returned from server");
    }
    var _Add = new Add.Add_Item(msg.ItemData, msg.Brands);
    _Add.Init(msg);
    document.getElementById("FullNav").style.width = "100%";
}

export function DeleteItem(ValueToDelete){
    //Can do something before Going to Delete Item
    lib.DeleteItem(ValueToDelete);
    //Can do something after Deleting Item
}