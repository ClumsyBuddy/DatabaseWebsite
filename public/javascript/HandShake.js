import * as lib from "./Main.js";

/*
*   This File contains the "MiddleWare" for all Socket client calls. Using this we can log, change or check for errors
*   before and after any function calls without bloating the SocketHandler with code. This also allows us
*   to check for errors alot better as we can try catch and return the errors without bloating the Main Code
*/

export function InitializeProductList(ProductList){
    console.log("First");
    lib.FirstBuild(ProductList);
}


export function AddItemData(msg){
    lib.AddItemData(msg);
}

export function DeleteItem(ValueToDelete){
    //Can do something before Going to Delete Item
    lib.DeleteItem(ValueToDelete);
    //Can do something after Deleting Item
}