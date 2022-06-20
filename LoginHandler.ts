import { DatabaseManager } from "./DatabaseManager";

class Login{

    private c_DbController: DatabaseManager;
    private db_Name = "Login";

    protected Permission: {
        Low: number,
        Mid:number,
        High:number
    }


    constructor(DbController:DatabaseManager){
        this.c_DbController = DbController;                     //TODO need to make this more dynamic (Probably auto propogate the ReponseHandler Object)
        this.c_DbController.createTable(this.db_Name, "Login", "username TEXT NOT NULL, password TEXT NOT NULL, permission TEXT NOT NULL, \
                                                        Warehouse INTEGER NOT NULL, Sable INTEGER NOT NULL, Diplomat INTEGER NOT NULL, RDI INTEGER NOT NULL");
        this.Permission = {
            Low:1,
            Mid:2,
            High:3
        }
    }
    
    /*  Attempt to login using a async function that awaits the results
    *   Check if the email exists in the database. Then check if the email and password match what we found
    *   Then set all of the variables to their correct values found in the database
    */ 
    async LoginAttempt(req, res, username:string, password:string){
        await this.c_DbController.getByColumn(this.db_Name, "username", username.toLowerCase()).then((result:any) => {

            if(result !== undefined && result.password == password && result.username == username.toLowerCase()){
                req.session.loggedin = true; //We are logged in
                req.session.username = result.username;  //Get the USername
                var PageState = {
                    LoginForm:false,
                    CurrentRenderTarget:"/",
                    Title:"Database",
                    _Action:"/",
                };
                var PageData = {
                    ProductList: [],
                    AllowedActions:{
                        Delete:this.PermissionLevel(req, this.Permission.High, result.permission),
                        Update:this.PermissionLevel(req, this.Permission.Mid, result.permission),
                        Create:this.PermissionLevel(req, this.Permission.Mid, result.permission),
                        ViewLogs:this.PermissionLevel(req, this.Permission.Low, result.permission)
                    },
                    UserPermission: result.permission,
                    WareHouse: result.Warehouse, //Get whether its warehouse
                    Sable: result.Sable, //get Whether its Sable
                    Diplomat: result.Diplomat, //Get Whether its diplomat
                    RDI: result.RDI //Get whether its RDI
                };
                console.log(result.permission);;
                req.session.PageState = PageState;
                req.session.PageData = PageData;
            }else{
                req.session.loggedin = false;
            }
            req.session.save();
        })
    }
    public PermissionLevel(req, Required:number, currLevel:number){
        return currLevel >= Required ? true : false;
    }
}

export {Login};