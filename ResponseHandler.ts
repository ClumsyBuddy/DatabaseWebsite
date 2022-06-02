import { DatabaseManager } from "./DatabaseManager";

const DBManager = require("./DatabaseManager");


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
}

export {ResponseHandler};