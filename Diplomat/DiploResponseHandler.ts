import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import { ResponseHandler } from "../ResponseHandler";





class DiploResponseHandler extends ResponseHandler{
    ItemType:{
        Coffe:0,
        CoffeMaker:1,
    }
    constructor(DBController:DatabaseManager, User:Login){
        super(DBController, User);
        this.DBController.createTable("Diplomat", "Diplomat", "id TEXT, itemtype TEXT"); //Create Diplomat Table
    }

}





export {DiploResponseHandler};