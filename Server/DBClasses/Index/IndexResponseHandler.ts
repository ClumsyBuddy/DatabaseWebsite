import { ResponseHandler } from "../../Response/ResponseHandler.js";
import {Login, DatabaseManager} from "../../../Sockets/ServerGlobals.js";

class IndexResponseHandler extends ResponseHandler{

    constructor(DbController:DatabaseManager, User:Login, io){
            super(DbController, User, io, {ClassName:"Index", TableName:"Index"});
    }

    async Login(req: any, res: any){
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