import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";

class  ResponseHandler{
    DBController: DatabaseManager;
    public PageState:{
        LoginForm:boolean,
        Switch:{On:boolean, Off:boolean},
        PopUp:boolean,
        Form:{Edit:boolean, Add:boolean},
        CurrentRenderTarget:string,
        Title:string,
        _Action:string
    };

    private User:Login;
    Username:string;

    Permission: {
        Low:0,
        Mid:1,
        High:2
    }

    public AllowedActions: {
        Delete:boolean,
        Update:boolean,
        Create:boolean,
        ViewLogs:boolean,
    };

    constructor(DBController: DatabaseManager, User:Login){
        this.DBController = DBController;
        this.User = User;
        this.PageState.CurrentRenderTarget = "index";
        this.PageState.Form.Add = false;
        this.PageState.Form.Edit = false;
        this.PageState.LoginForm = false;
        this.PageState.PopUp = false;
        this.PageState.Switch.Off = false;
        this.PageState.Switch.On = true;

        this.AllowedActions = {
                Delete:false,
                Update:false,
                Create:false,
                ViewLogs:false,
        }
    }

    public InitLogin(){
        if(this.User.IsLogin){
            this.Username = this.User.User;
            
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
        res.render(BuildRenderTarget, {PageState:this.PageState, Data:PageData});
    }



}

export {ResponseHandler};