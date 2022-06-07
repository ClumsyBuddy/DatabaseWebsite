import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import { ResponseHandler } from "../ResponseHandler";


class DiploResponseHandler extends ResponseHandler{

    private PageData?:{
        ProductList?:Array<Object>
    }

    constructor(DBController:DatabaseManager, User:Login){
        var Name = "Diplomat";
        super(DBController, User, Name, Name);

        this.PageData = {
            ProductList: []
        }



        this.ItemInformation = this.ParseJson("./Diplomat/DiploOptions.json", this.UpdateItemInformation.bind(this));

        //this.DBController.createTable("Diplomat", "Diplomat", "id TEXT, itemtype TEXT"); //Create Diplomat Table

        this.PageState.CurrentRenderTarget = "Diplomat";
    }

    _Get(req: any, res: any): void {
        this.RenderPage(req, res,this.PageData);
    }
    _Post(req: any, res: any): void {
        this.RenderPage(req, res,this.PageData);
    }


}





export {DiploResponseHandler};