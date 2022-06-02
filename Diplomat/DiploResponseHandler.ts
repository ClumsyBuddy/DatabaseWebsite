import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import { ResponseHandler } from "../ResponseHandler";





class DiploResponseHandler extends ResponseHandler{
    ItemType:{
        Coffe:0,
        CoffeMaker:1,
    }
    constructor(DBController:DatabaseManager, User:Login){
        super(DBController);
        this.DBController.createTable("Diplomat", "Diplomat", "id TEXT, itemtype TEXT");
    }

}





export {DiploResponseHandler};