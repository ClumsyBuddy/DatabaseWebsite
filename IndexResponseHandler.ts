import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";
import { ResponseHandler } from "./ResponseHandler";


class IndexResponseHandler extends ResponseHandler{

    private PageData?: {

    };

    constructor(DbController:DatabaseManager, User:Login, app:any){
            super(DbController, User, "Index");
    }
    LoginForm(req: any, res: any) : void{
        this.PageState.LoginForm = req.body.LoginForm == "true" ? false : true; //if the Login for is true then make it false
        if(this.PageState.LoginForm){
            this.PageState.CancelButton.Name = "LoginForm"; //assign cancelbutton to LoginForm so we can change LoginForms value using cancelbutton
            this.PageState.CancelButton.Value = true; //We assign it to true. This ensures when we press it it will change LoginForm to false
        }
        this._Get(req, res);
    }



    /*
    *   This is the general layout for all Button Interactions
    *   Get the current state of the menu
    *   Set cancel button to the menu
    *   Render page
    *   What this does it allow the menu to be controller by a single Variable and allow cancel button to 
    *   use its Reponse Object to update the form
    */
    _Get(req: any, res: any): void {

        this.RenderPage(req, res, this.PageData); //Render the page
    }
}

export {IndexResponseHandler};