import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";
import { ResponseHandler } from "./ResponseHandler";


class IndexResponseHandler extends ResponseHandler{
    constructor(DbController:DatabaseManager, User:Login, app:any){
            super(DbController, User, "Index");
    }

    OpenLogin(req, res, Data){
        this.PageState.LoginForm = req.body.LoginForm == "true" ? false : true;
        if(this.PageState.LoginForm){
            this.PageState.CancelButton.Name = "LoginForm";
            this.PageState.CancelButton.Value = true;
        }
        this.RenderPage(req, res, Data);
    }
}

export {IndexResponseHandler};