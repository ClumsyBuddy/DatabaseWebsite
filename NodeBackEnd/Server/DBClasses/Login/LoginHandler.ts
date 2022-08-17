import { runInNewContext } from "vm";
import {DatabaseManager} from "../../Database/DatabaseManager";

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
        this.c_DbController.createTable(this.db_Name, "username TEXT NOT NULL, password TEXT NOT NULL, permission TEXT NOT NULL, \
                                                        Warehouse INTEGER NOT NULL, Sable INTEGER NOT NULL, Diplomat INTEGER NOT NULL, RDI INTEGER NOT NULL");
        this.Permission = {
            Low:1,
            Mid:2,
            High:3
        }
    }
    
    async LoginAttempt(req, res, username:string, password:string){
        return await this.c_DbController.getByColumn(this.db_Name, "username", username.toLowerCase()).then(async (result:any) => {

            if(result !== undefined && result.password == password && result.username == username.toLowerCase()){
                req.session.username = result.username;  //Get the USername
                var UserData = {
                    ProductList: [],
                    AllowedActions:{
                        Delete:this.PermissionLevel(req, this.Permission.High, result.permission),
                        Update:this.PermissionLevel(req, this.Permission.Mid, result.permission),
                        Create:this.PermissionLevel(req, this.Permission.Mid, result.permission),
                        ViewLogs:this.PermissionLevel(req, this.Permission.Low, result.permission)
                    },
                    UserPermission: result.permission,
                    Sable: result.Sable, //get Whether its Sable
                    Diplomat: result.Diplomat, //Get Whether its diplomat
                    RDI: result.RDI //Get whether its RDI
                };
                req.session.UserData = UserData;
                req.session.isLogin = true;
                req.session.save();
                return true;
            }
            req.session.isLogin = false;
            return false;
        })
    }
    public PermissionLevel(req, Required:number, currLevel:number){
        return currLevel >= Required ? true : false;
    }
}

export {Login};