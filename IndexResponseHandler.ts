import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";
import { ResponseHandler } from "./ResponseHandler";


class IndexResponseHandler extends ResponseHandler{

    private PageData: {
        Warehouse:number,
        LoginFailed:boolean,
        Sable:boolean,
        Diplomat:boolean,
        RDI:boolean
    };

    constructor(DbController:DatabaseManager, User:Login, app:any){
            super(DbController, User, "Index");
            this.PageData = {
                Warehouse:0,
                LoginFailed:false,
                Sable: false,
                Diplomat: false,
                RDI: false
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
            this.InitLogin(req, res);
            this.SetCurrentRenderTarget("DataBaseSelection");
            this.PageData.Warehouse = req.session.WareHouse;
            this.PageData.Sable = req.session.Sable;
            this.PageData.Diplomat = req.session.Diplomat;
            this.PageData.RDI = req.session.RDI;
            
        }else{
            this.PageData.LoginFailed = req.session.loginfailed;
        }
        this._Get(req, res);
    }
    async Logout(req, res){
        //req.session.destroy();
        req.session.loggedin = false;
        this.SetCurrentRenderTarget("/");
        this._Get(req, res);
    }

    // Override for _Get. This uses PageData from the class
    async _Get(req: any, res: any, _Action:string = undefined) {
        if(_Action != undefined){
            this.RenderPage(req, res, _Action); //Render the page
        }else{
            this.RenderPage(req, res, this.PageData); //Render the page
        }
    }
    async _Post(req: any, res: any) {
        this.RenderPage(req, res, this.PageData);
    }
}

export {IndexResponseHandler};