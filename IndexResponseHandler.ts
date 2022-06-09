import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";
import { ResponseHandler } from "./ResponseHandler";


class IndexResponseHandler extends ResponseHandler{

    private PageData: {
        Warehouse:number
    };

    constructor(DbController:DatabaseManager, User:Login, app:any){
            super(DbController, User, "Index");
            this.PageData = {
                Warehouse:0
            }
    }


    /*
    *   This is the general layout for all Button Interactions
    *   Get the current state of the menu
    *   Set cancel button to the menu
    *   Render page
    *   What this does it allow the menu to be controller by a single Variable and allow cancel button to 
    *   use its Reponse Object to update the form
    */
    async Login(req: any, res: any){
        
        await this.User.LoginAttempt(req, res, req.body.email, req.body.password);
        if(req.session.loggedin){
            this.InitLogin(req, res, true);
        }
        this._Get(req, res);
    }

    // Override for _Get. This uses PageData from the class
    _Get(req: any, res: any): void {


        if(req.session.loggedin){
            this.SetCurrentRenderTarget("DataBaseSelection");
            console.log(req.session.WareHouse);
            this.PageData = {
                Warehouse:req.session.WareHouse
            }
        }else{
            this.SetCurrentRenderTarget("Index");
        }
        this.RenderPage(req, res, this.PageData); //Render the page
    }
    _Post(req: any, res: any): void {
        this.RenderPage(req, res, this.PageData);
    }
}

export {IndexResponseHandler};