import { DatabaseManager } from "./DatabaseManager";




class Login{

    private c_Email: string;
    private c_Password: string;
    private c_User: string;
    private c_UserPermissions: number;
    private c_DbController: DatabaseManager;
    private db_Name = "Login";
    private LoginReject: boolean;
    private LoggedIn:boolean;


    constructor(DbController:DatabaseManager){
        this.c_DbController = DbController;
        this.c_DbController.createTable(this.db_Name, "Login", "user TEXT, email TEXT, password TEXT, permission TEXT");
        this.LoggedIn = false;
    }
    

    /*  Attempt to login using a async function that awaits the results
    *   Check if the email exists in the database. Then check if the email and password match what we found
    *   Then set all of the variables to their correct values found in the database
    */ 
    async LoginAttempt(email:string, password:string){
        await this.c_DbController.getByColumn(this.db_Name, "email", email).then((result:any) => {
            if(result.password == password && result.email == email){
                this.c_User = result.user;
                this.c_Email = result.email;
                this.c_Password = result.password;
                this.c_UserPermissions = result.permission;
                this.LoginReject = false;
                this.LoggedIn = true;
            }else{
                this.LoginReject = true;
            }
        })
        return this.LoginReject;
    }

    /*
    *   If the User Permission Level is more than or equal too the Required then return true else return false
    */
    public PermissionLevel(Required:number){
        return this.c_UserPermissions >= Required ? true : false;
    }

    public get User() : string { //Gets the Users name
        return this.c_User;
    }
    
    public get IsLogin() : boolean {
        return this.LoggedIn;
    }
    public set IsLogin(value:boolean){
        this.LoggedIn = value;
    } 







}






export {Login};