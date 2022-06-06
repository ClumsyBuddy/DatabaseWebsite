import { json } from "express/lib/response";
import { Interface } from "readline";
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
    readonly BasePageState: any;


    protected ItemInformation: any;
    private Items: Array<any>;
    protected ItemTypes: Array<string>;
    protected ItemOptions: any;
    protected ItemValues: Array<string>
    protected Column: Array<string>;

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
        this.Items = [];
        this.ItemTypes = [];
        this.ItemOptions = [];
        this.BasePageState = {
            LoginForm:false,
            Switch:{On:true, Off:false},
            PopUp:false,
            Form:{Edit:false, Add:false},
            CurrentRenderTarget:"index",
            Title:"Database",
            _Action:"/",
            CancelButton:{}
            };
        this.PageState = this.deepCopy(this.BasePageState);
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
    async UpdateItemInformation(newValue:any){
        /*
        *   This Blob here Gets the Names of the Objects and the objects themselves
        */
        this.Items = Object.values(newValue);
        for(var _node in newValue){
            this.ItemTypes = Object.keys(newValue);            
        }
        /*
        * Retrieve all Item Options
        */
        for(var Option in this.Items){
            if(typeof this.Items[Option] === 'object'){            
                Object.keys(this.Items[Option]).forEach((item) =>{
                    if(!this.ItemOptions.includes(item)){
                        this.ItemOptions.push(item);
                    }
                });
            }
        }
        console.log(this.ItemOptions);
        /*
        *   Now I need to get all current columns
        */
       
        this.DBController.getColumns(this.TableName).then((result) => {
            for(var _node in result){
                console.log(result[_node].name);
            }
        })
      
        var ColumnBuilder = ``;
        for(var items in this.ItemOptions){

        }
    }

    ParseItemInformation(newValue:any) : void{
       
    }

    /*
    *   Called in constructor of child class. Starts the watch event for the file
    *   Calls a callback to handle changes to file
    */
    public ParseJson(FilePath:string, callback:Function) : void{
        let rawdata = fs.readFileSync(FilePath); //Read file
        let ParsedData = JSON.parse(rawdata); //Parse Json data
        this.UpdateItemInformation(ParsedData);
        fs.watchFile(FilePath, {
            bigint: false,
            persistent: true,
            interval: 500,
          },(curr, prev) => { //Watches specfied file
            try{
                let rawdata = fs.readFileSync(FilePath);
                let ParsedData = JSON.parse(rawdata);
                callback(ParsedData); //Callback to handle changes after
            }catch(e){
                console.log(`Error: ${e} | @${FilePath}`);
            }
        })
    }


     deepCopy(obj) {
        var copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.deepCopy(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

}

export {ResponseHandler};