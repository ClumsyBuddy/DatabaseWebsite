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
    LoginAttempt(req, res, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.c_DbController.getByColumn(this.db_Name, "username", username.toLowerCase()).then((result) => __awaiter(this, void 0, void 0, function* () {
                if (result !== undefined && result.password == password && result.username == username.toLowerCase()) {
                    req.session.username = result.username; //Get the USername
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
                    req.session.PageData = PageData;
                    return true;
                }
                return false;
            }));
        });
    }
    PermissionLevel(req, Required, currLevel) {
        return currLevel >= Required ? true : false;
    }
}
export { Login };
