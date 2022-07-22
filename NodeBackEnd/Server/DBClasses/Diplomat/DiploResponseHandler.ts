import { ResponseHandler } from "../../Response/ResponseHandler.js";
import {DatabaseManager} from "../../Database/DatabaseManager";
import {Login} from "../Login/LoginHandler";

class DiploResponseHandler extends ResponseHandler{

    constructor(DBController:DatabaseManager, User:Login, io){
        var Name = "Diplomat";
        super(DBController, User, io, {ClassName:Name, TableName:Name} );

        //this.ItemInformation = this.ParseJson("./Diplomat/DiploOptions.json", this.UpdateItemInformation.bind(this));

        //this.DBController.createTable("Diplomat", "Diplomat", "id TEXT, itemtype TEXT"); //Create Diplomat Table

    }

    async _Get(req: any, res: any) {
        req.session.CurrentRenderTarget = "Diplomat";
        this.RenderPage(req, res);
    }
    async _Post(req: any, res: any) {
        this.RenderPage(req, res);
    }

}

export {DiploResponseHandler};