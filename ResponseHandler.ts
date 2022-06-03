import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";

const fs = require('fs');

//TODO Need to implement responsice error handling so a single bug doesnt bring down the server
//     Try catch and using base state should be able to keep the server from crashing
//  https://stackoverflow.com/questions/34834151/how-to-catch-errors-when-rendering-ejs-view-node-js
// Possibly a good method of error handling
class  ResponseHandler{
    DBController: DatabaseManager;

    //TODO Need to make sure every Button is as variable as CancelButton
    protected PageState:{
        LoginForm:boolean,
        Switch:{On:boolean, Off:boolean},
        PopUp:boolean,
        Form:{Edit:boolean, Add:boolean},
        CurrentRenderTarget:string,
        Title:string,
        _Action:string,
        CancelButton:{Name?:string, Value?:boolean}
        };
    
    readonly BasePageState = {
        LoginForm:false,
        Switch:{On:true, Off:false},
        PopUp:false,
        Form:{Edit:false, Add:false},
        CurrentRenderTarget:"index",
        Title:"Database",
        _Action:"/",
        CancelButton:{}
        };


    protected ItemInformation: any;

    private ClassName: string;
    private TableName: string;
    
    private User:Login;
    protected Username:string;

    Permission: {
        Low:0,
        Mid:1,
        High:2
    }

    protected AllowedActions:{
        Delete:boolean,
        Update:boolean,
        Create:boolean,
        ViewLogs:boolean,
    };

    constructor(DBController: DatabaseManager, User:Login, ClassName, TableName=undefined){
        this.DBController = DBController;
        this.User = User;
        this.ClassName = ClassName;
        this.TableName = TableName;
        this.PageState = this.BasePageState;
        this.AllowedActions = {
                Delete:false,
                Update:false,
                Create:false,
                ViewLogs:false,
        }
    }
    //Resets a specific Value in PageState to the base value
    public ResetPageState(ValueToReset:string) : void {
        this.PageState[ValueToReset] = this.BasePageState[ValueToReset];
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
        res.render(BuildRenderTarget, {PageState:this.PageState, Data:PageData}, function(err, html) {
            if(err){
                console.log(err);
                res.sendFile(__dirname + "/public/404.html");
            }else{
                res.send(html);
            }
        });
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
        //TODO This functions purpose is to update Iteminformation and 
        //     Parse and update its corresponding table in the Database
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