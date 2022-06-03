import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";

const fs = require('fs');

class  ResponseHandler{
    DBController: DatabaseManager;
    public PageState:any;

    public ItemInformation: any;

    private ClassName: string;
    private TableName: string;

    private User:Login;
    Username:string;

    Permission: {
        Low:0,
        Mid:1,
        High:2
    }

    public AllowedActions:any;

    constructor(DBController: DatabaseManager, User:Login, ClassName, TableName=undefined){
        this.DBController = DBController;
        this.User = User;
        this.ClassName = ClassName;
        this.TableName = TableName;
        this.PageState = {
        LoginForm:false,
        Switch:{On:true, Off:false},
        PopUp:false,
        Form:{Edit:false, Add:false},
        CurrentRenderTarget:"index",
        Title:"Database",
        _Action:"/"
        };

        this.AllowedActions = {
                Delete:false,
                Update:false,
                Create:false,
                ViewLogs:false,
        }
    }

    /*
    *                               Login Initialization
    *   This will be called when a login has been achieved so that allowed actions can be updated
    */
    public InitLogin() : void{
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

    /*
    *   Basic Render Page function that Gives PageData from the child and PageState to handle Templating of the page
    */
    public RenderPage(req, res, PageData){
        var BuildRenderTarget = `pages/${this.PageState.CurrentRenderTarget}`;
        res.render(BuildRenderTarget, {PageState:this.PageState, Data:PageData});
    }
    /*
    *   Basic Get and Post functions. Ment to be overriden with childerens specfic get and post
    */
    _Get(req, res, Data) : void{
        this.RenderPage(req, res, Data);
    }
    _Post(req, res) : void{

    }
    /*
    *   Update item information and itemtypes and then parse the table and 
    */
    UpdateItemInformation(newValue:any) : void{
        //console.log(this.Item_Information_Get);
        this.ItemInformation = newValue;
    }
    /*
    *   Called in constructor of child class. Starts the watch event for the file
    *   Calls a callback to handle changes to file
    */
    public ParseJson(FilePath:string, callback:Function) : void{
        let rawdata = fs.readFileSync(FilePath); //Read file
        let ParsedData = JSON.parse(rawdata); //Parse Json data
        fs.watchFile(FilePath, (curr, prev) => { //Watches specfied file
            try{
                let rawdata = fs.readFileSync(FilePath);
                let ParsedData = JSON.parse(rawdata);
                callback(ParsedData); //Callback to handle changes after
            }catch(e){
                console.log(`Error: ${e} | @${FilePath}`);
            }
        })
        return ParsedData;
    }
}

export {ResponseHandler};