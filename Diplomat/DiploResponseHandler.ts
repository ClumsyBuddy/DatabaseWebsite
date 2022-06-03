import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import { ResponseHandler } from "../ResponseHandler";





class DiploResponseHandler extends ResponseHandler{
    ItemType:{
        Coffe:0,
        CoffeMaker:1,
    }
    constructor(DBController:DatabaseManager, User:Login){
        var Name = "Diplomat";
        super(DBController, User, Name, Name);

        this.ItemInformation = this.ParseJson("./Diplomat/DiploOptions.json", this.UpdateItemInformation.bind(this));

        this.DBController.createTable("Diplomat", "Diplomat", "id TEXT, itemtype TEXT"); //Create Diplomat Table
    }

}





export {DiploResponseHandler};