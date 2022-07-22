var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Login {
    constructor(DbController) {
        this.db_Name = "Login";
        this.c_DbController = DbController; //TODO need to make this more dynamic (Probably auto propogate the ReponseHandler Object)
        this.c_DbController.createTable(this.db_Name, "Login", "username TEXT NOT NULL, password TEXT NOT NULL, permission TEXT NOT NULL, \
                                                        Warehouse INTEGER NOT NULL, Sable INTEGER NOT NULL, Diplomat INTEGER NOT NULL, RDI INTEGER NOT NULL");
        this.Permission = {
            Low: 1,
            Mid: 2,
            High: 3
        };
    }
    /*  Attempt to login using a async function that awaits the results
    *   Check if the email exists in the database. Then check if the email and password match what we found
    *   Then set all of the variables to their correct values found in the database
    */
    LoginAttempt(req, res, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.c_DbController.getByColumn(this.db_Name, "username", username.toLowerCase()).then((result) => {
                if (result !== undefined && result.password == password && result.username == username.toLowerCase()) {
                    req.session.loggedin = true; //We are logged in
                    req.session.username = result.username; //Get the USername
                    //console.log("Hello Login");
                    var PageState = {
                        LoginForm: false,
                        CurrentRenderTarget: "/",
                        Title: "Database",
                        _Action: "/",
                    };
                    var PageData = {
                        ProductList: [],
                        AllowedActions: {
                            Delete: this.PermissionLevel(req, this.Permission.High, result.permission),
                            Update: this.PermissionLevel(req, this.Permission.Mid, result.permission),
                            Create: this.PermissionLevel(req, this.Permission.Mid, result.permission),
                            ViewLogs: this.PermissionLevel(req, this.Permission.Low, result.permission)
                        },
                        UserPermission: result.permission,
                        WareHouse: result.Warehouse,
                        Sable: result.Sable,
                        Diplomat: result.Diplomat,
                        RDI: result.RDI //Get whether its RDI
                    };
                    req.session.PageState = PageState;
                    req.session.PageData = PageData;
                }
                else {
                    req.session.loggedin = false;
                }
                req.session.save();
            });
        });
    }
    PermissionLevel(req, Required, currLevel) {
        return currLevel >= Required ? true : false;
    }
}
export { Login };
