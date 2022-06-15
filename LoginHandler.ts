import { DatabaseManager } from "./DatabaseManager";




class Login{

    private c_DbController: DatabaseManager;
    private db_Name = "Login";

    constructor(DbController:DatabaseManager){
        this.c_DbController = DbController;                     //TODO need to make this more dynamic (Probably auto propogate the ReponseHandler Object)
        this.c_DbController.createTable(this.db_Name, "Login", "username TEXT NOT NULL, password TEXT NOT NULL, permission TEXT NOT NULL, \
                                                        Warehouse INTEGER NOT NULL, Sable INTEGER NOT NULL, Diplomat INTEGER NOT NULL, RDI INTEGER NOT NULL");
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
                req.session.userPermission = result.permission; //get the Permission level
                req.session.WareHouse = result.Warehouse; //Get whether its warehouse
                req.session.Sable = result.Sable; //get Whether its Sable
                req.session.Diplomat = result.Diplomat; //Get Whether its diplomat
                req.session.RDI = result.RDI; //Get whether its RDI
                var AllowedActions = {
                    Delete:false,
                    Update:false,
                    Create:false,
                    ViewLogs:false,
                }
                req.session.AllowedActions = AllowedActions;
                req.loginfailed = false;
            }else{
                req.session.loginfailed = true;
                req.session.loggedin = false;

            }
        })
    }



    public PermissionLevel(req, Required:number){
        return req.session.userPermission >= Required ? true : false;
    }
}






export {Login};