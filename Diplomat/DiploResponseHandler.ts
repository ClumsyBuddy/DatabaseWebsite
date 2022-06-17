import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import { ResponseHandler } from "../ResponseHandler";


class DiploResponseHandler extends ResponseHandler{

    public PageData?:{
        ProductList?:Array<Object>
    }

    constructor(DBController:DatabaseManager, User:Login, io){
        var Name = "Diplomat";
        super(DBController, User, io, {ClassName:Name, TableName:Name} );

        this.PageData = {
            ProductList: []
        }



        //this.ItemInformation = this.ParseJson("./Diplomat/DiploOptions.json", this.UpdateItemInformation.bind(this));

        //this.DBController.createTable("Diplomat", "Diplomat", "id TEXT, itemtype TEXT"); //Create Diplomat Table

        this.PageState.CurrentRenderTarget = "Diplomat";
    }

    async _Get(req: any, res: any) {
        this.RenderPage(req, res,this.PageData);
    }
    async _Post(req: any, res: any) {
        this.RenderPage(req, res,this.PageData);
    }


}





export {DiploResponseHandler};