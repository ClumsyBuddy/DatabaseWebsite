import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import {ResponseHandler} from "../ResponseHandler";




class SableResponseHandler extends ResponseHandler{
    ItemInformation: {
        key:string,
        id:string,
        itemType:number,
        color:string,
        size:object,
        quantity:number,
        price:number,
        decription:string,
        style:string,
        sideNumber:string,
        propertyName:string,
        address:string,
        
    }
    ItemTypes: {
        Uniform: 0
    }
    ColorId: {
     Red:0,
     White:1   
    }
    Color:{
        0:"RED",
        1:"WH"
    }

    constructor(DBController:DatabaseManager, User:Login){
        super(DBController);
        this.DBController.createTable("Sable", "Sable", "id TEXT, brand TEXT"); //Create Sable Table
    }

}



export {SableResponseHandler};