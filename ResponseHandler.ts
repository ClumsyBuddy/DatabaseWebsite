import { DatabaseManager } from "./DatabaseManager";

class  ResponseHandler{
    DBController: DatabaseManager;
    public PageState: {        
            LoginForm:boolean,
            Switch:{On:true, Off:false},
            PopUp:boolean,
            Form:{Edit:boolean, Add:boolean},
        };
    constructor(DBController: DatabaseManager){
        this.DBController = DBController;
        }

        Init(){ //Initialize PageState
            this.PageState.LoginForm = this.PageState.Switch.Off;
            this.PageState.PopUp = this.PageState.Switch.Off;
            this.PageState.Form.Add = this.PageState.Switch.Off;
            this.PageState.Form.Edit = this.PageState.Switch.Off;
        }


}

export {ResponseHandler};