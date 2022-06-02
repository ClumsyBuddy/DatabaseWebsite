import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import {ResponseHandler} from "../ResponseHandler";

class SableResponseHandler extends ResponseHandler{
    ItemInformation: {
        key:string,
        id:string,
        itemType:{
            Uniform:0
        },
        Options:{
            color:{White:"WH", Red:"RED"},
            size:object,
            quantity:number,
            style:string,
            sideNumber:string,
            propertyName:string,
            address:string,
        }
        
        price:number,
        decription:string,
        
    }
    constructor(DBController:DatabaseManager, User:Login){
        super(DBController, User);
        this.DBController.createTable("Sable", "Sable", "id TEXT, brand TEXT"); //Create Sable Table
        this.PageState.CurrentRenderTarget = "Sable";
        
    }


    _Get(req, res){
        this.RenderPage(req, res, this.ItemInformation);
    }
    _Post(req, res){

    }




}



export {SableResponseHandler};