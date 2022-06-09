import { DatabaseManager } from "./DatabaseManager";




class Login{

    private c_Email: string;
    private c_Password: string;
    private c_User: string;
    private c_UserPermissions: number;
    private c_DbController: DatabaseManager;
    private db_Name = "Login";
    private LoginReject: boolean;

    protected DataBaseAccess:{
        WareHouse:boolean,
        Sable:boolean,
        Diplomat:boolean,
        RDI:boolean
    }


    constructor(DbController:DatabaseManager){
        this.c_DbController = DbController;                     //TODO need to make this more dynamic (Probably auto propogate the ReponseHandler Object)
        this.c_DbController.createTable(this.db_Name, "Login", "user TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, permission TEXT NOT NULL, \
                                                        Warehouse INTEGER NOT NULL, Sable INTEGER NOT NULL, Diplomat INTEGER NOT NULL, RDI INTEGER NOT NULL");
        this.DataBaseAccess = {
            WareHouse:false,
            Sable: false,
            Diplomat:false,
            RDI:false
        }
    }
    

    /*  Attempt to login using a async function that awaits the results
    *   Check if the email exists in the database. Then check if the email and password match what we found
    *   Then set all of the variables to their correct values found in the database
    */ 
    async LoginAttempt(req, res, email:string, password:string){
        await this.c_DbController.getByColumn(this.db_Name, "email", email).then((result:any) => {
            console.log(result);
            if(result !== undefined && result.password == password && result.email == email){
                this.c_User = result.user;
                this.c_Email = result.email;
                this.c_Password = result.password;
                this.c_UserPermissions = result.permission;
                this.LoginReject = false;
                this.DataBaseAccess = {
                    WareHouse: result.Warehouse,
                    Sable:result.Sable,
                    Diplomat: result.Diplomat,
                    RDI:result.RDI
                }
                req.session.username = result.user;
                req.session.loggedin = true;
                req.session.userPermission = result.permission;
                req.session.WareHouse = this.DataBaseAccess.WareHouse;


            }else{
                this.LoginReject = true;
            }
        })
        return this.LoginReject;
    }

    /*
    *   If the User Permission Level is more than or equal too the Required then return true else return false
    */
    public PermissionLevel(req, Required:number){
        return req.session.userPermission >= Required ? true : false;
    }

    public get User() : string { //Gets the Users name
        return this.c_User;
    }
    
    public get Permission() : number{
        return this.c_UserPermissions;
    }

    public get DBAccess() : any{
        return this.DataBaseAccess;
    }






}






export {Login};