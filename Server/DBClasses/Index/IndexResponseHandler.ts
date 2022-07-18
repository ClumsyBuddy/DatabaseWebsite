import { DatabaseManager } from "../../Database/DatabaseManager";
import { Login } from "../Login/LoginHandler";
import { ResponseHandler } from "../../Response/ResponseHandler";


class IndexResponseHandler extends ResponseHandler{

    private PageData: {
        Warehouse:number,
        LoginFailed:boolean,
        Sable:boolean,
        Diplomat:boolean,
        RDI:boolean
    };

    constructor(DbController:DatabaseManager, User:Login, io){
            super(DbController, User, io, {ClassName:"Index", TableName:"Index"});
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
        //console.log("LoginFirst");
        await this.User.LoginAttempt(req, res, req.body.email, req.body.password);
        if(req.session.loggedin){
            req.session.PageState.CurrentRenderTarget = "DataBaseSelection";
            this._Get(req, res);
        }else{
            this.RenderLogin(req, res);
        }
        
    }
    async Logout(req, res){
        req.session.destroy();
        //req.session.loggedin = false;
        //req.session.PageState.CurrentRenderTarget = "/";
        this.RenderLogin(req, res);
    }

    async RenderLogin(req, res){
        var BuildRenderTarget = `pages/index`;
        var PageState = {
            CurrentRenderTarget:"index",
            Title:"Database",
            _Action:"/",
        };
        var PageData = {
            ProductList: [],
            AllowedActions:{
                Delete:false,
                Update:false,
                Create:false,
                ViewLogs:false
            }
        };
        res.render(BuildRenderTarget, {PageState:PageState, Data:PageData}, function(err, html) {
            if(err){
                console.log(err);
                try{
                    res.sendFile(__dirname + "../../../public/404.html");
                }catch(e){
                    res.send("ERROR");
                    console.log(e);
                }
            }else{
                res.status(200).send(html)
            }
        });
    }


    // Override for _Get. This uses PageData from the class
    async _Get(req: any, res: any) {
        this.RenderPage(req, res); //Render the page
    }
    async _Post(req: any, res: any) {
        this.RenderPage(req, res);
    }
}

export {IndexResponseHandler};