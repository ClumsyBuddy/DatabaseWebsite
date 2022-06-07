import { stringify } from "querystring";
import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";

const fs = require('fs');


class ItemData{
    public ItemType:string;
    public Options:Array<any>;
    public Values:Array<any>;
    constructor(_ItemType){
        this.ItemType = _ItemType;
        this.Options = [];
    }
    public AddOptions(_option:any, values:Array<string>){
        this.Options.push({[_option]: values});
        console.log(this.Options);
    }
}


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

    protected ItemDataArray:Array<ItemData>;

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
        this.ItemDataArray = [];
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

    //TODO Need to create utility file that will contain all of the utility functions, need to put deep copy and mergearray into that instead of sitting here

    /*
    *   Update item information and itemtypes and then parse the table and 
    */
    async UpdateItemInformation(newValue:any){
        /*
        *   This Blob here Gets the Names of the Objects and the objects themselves
        */
       //console.log(newValue);
        //this.Items = Object.values(newValue); //Got All ItemTypes
        this.Items = newValue;
        for(var _node in newValue){
            this.ItemTypes = Object.keys(newValue);            
        }
        /*
        * Retrieve all Item Options
        */
        for(var Option in this.Items){ //Got All Options
            if(typeof this.Items[Option] === 'object'){            
                Object.keys(this.Items[Option]).forEach((item) =>{
                    if(!this.ItemOptions.includes(item)){
                        this.ItemOptions.push(item);
                    }
                });
            }
        }
        //console.log(this.ItemOptions);
        /*
        *   Now I need to get all current columns
        *   Then check each column to see if it already has the option in it
        */
        this.DBController.getColumns(this.TableName).then((result) => { //Got all new options that table didnt have previously
            var newItems = []; //Stores all new Item
            for(var i = 0; i < this.ItemOptions.length; i++){
                var NewItem = true; //Boolean check for new items
                for(var j = 0; j < result.length; j++){
                    if(j == result.length - 1 && this.ItemOptions[i] != result[j].name){ //If its the end of the loop and they arent equal
                        if(NewItem){ //And it is a new item
                            newItems.push(this.ItemOptions[i]); //Add it to the list
                        }
                    }
                    if(this.ItemOptions[i] == result[j].name){//If it is in the Table then continue;
                        NewItem = false;
                        continue;
                    }
                }
            }
            /*
            *   Now I need To use the the full objects and parse it using the Itemtype and the Options it has to grab it's values
            *   I need to grab the values so I know what type the options are
            */
            
            for(var key in this.ItemTypes){
            }


            

            var ColumnBuilder = ``;
            for(var type in  this.ItemTypes){
                var CurrentItem = new ItemData(this.ItemTypes[type]);
                var Options = Object.keys(this.Items[this.ItemTypes[type]])
                for(var _node_one in Options){
                    var SavedValues = [];
                    for(var item in newItems){
                        if(Options[_node_one] == newItems[item]){
                            ColumnBuilder += ``;
                            if(typeof this.Items[this.ItemTypes[type]][Options[_node_one]] == 'object'){
                                for(var values in this.Items[this.ItemTypes[type]][Options[_node_one]]){
                                    SavedValues.push(this.Items[this.ItemTypes[type]][Options[_node_one]][values]);
                                }
                            }else{
                                SavedValues.push(this.Items[this.ItemTypes[type]][Options[_node_one]])
                            }
                            
                            CurrentItem.AddOptions(Options[_node_one], SavedValues);
                        }

                    }
                }
                this.ItemDataArray.push(CurrentItem);
            }

            

            /*
            *   Build or Alter the Table with the options
            */
           

            if(result.length == 0){
                console.log("No Table");
                this.DBController.createTable(this.TableName, this.ClassName, "email TEXT").then((result)=> { //Create Sable Table
                    //console.log(result);
                })
            }else{
                console.log("Table Exist");
            }
            

           
            

            //console.log("List: " + this.ItemOptions);
            //console.log("NewItems: " + newItems);
        })

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