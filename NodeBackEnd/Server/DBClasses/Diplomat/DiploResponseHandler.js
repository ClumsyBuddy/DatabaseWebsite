import { ResponseHandler } from "../../Response/ResponseHandler.js";
class DiploResponseHandler extends ResponseHandler {
    constructor(DBController, User, io) {
        var Name = "Diplomat";
        super(DBController, User, io, { ClassName: Name, TableName: Name });
        //this.ItemInformation = this.ParseJson("./Diplomat/DiploOptions.json", this.UpdateItemInformation.bind(this));
        //this.DBController.createTable("Diplomat", "Diplomat", "id TEXT, itemtype TEXT"); //Create Diplomat Table
    }
}
export { DiploResponseHandler };
