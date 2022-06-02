import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";

class  ResponseHandler{
    DBController: DatabaseManager;
    public PageState: {        
            LoginForm:boolean,
            Switch:{On:true, Off:false},
            PopUp:boolean,
            Form:{Edit:boolean, Add:boolean},
            CurrentRenderTarget:string
        };

    private User:Login;
    Username:string;

    Permission: {
        Low:0,
        Mid:1,
        High:2
    }

    AllowedActions: {
        Delete:boolean,
        Update:boolean,
        Create:boolean,
        ViewLogs:boolean,
    }

    constructor(DBController: DatabaseManager, User:Login){
        this.DBController = DBController;
        this.User = User;
        this.PageState.LoginForm = this.PageState.Switch.Off;
        this.PageState.PopUp = this.PageState.Switch.Off;
        this.PageState.Form.Add = this.PageState.Switch.Off;
        this.PageState.Form.Edit = this.PageState.Switch.Off;
        this.PageState.CurrentRenderTarget = "index";
        this.InitLogin();
        }



    private InitLogin(){
        if(this.User.IsLogin){
            this.Username = this.User.User;
            Object.keys(this.AllowedActions).forEach(key => { //Set All Allowed Actions to False
                this.AllowedActions[key] = true;
                });
            if(this.User.PermissionLevel(this.Permission.High)){
                Object.keys(this.AllowedActions).forEach(key => {
                    this.AllowedActions[key] = true;
                    });
            }
            if(this.User.PermissionLevel(this.Permission.Mid)){
                this.AllowedActions.ViewLogs = true;
                this.AllowedActions.Create = true;
                this.AllowedActions.Update = true;
            }
            if(this.User.PermissionLevel(this.Permission.Low)){
                this.AllowedActions.ViewLogs = true;
            }
        }
    }


    public RenderPage(req, res, PageData){
        var BuildRenderTarget = `pages/${this.PageState.CurrentRenderTarget}`;
        res.render(BuildRenderTarget, {PageState:this.PageState, PageData:PageData});
    }



}

export {ResponseHandler};