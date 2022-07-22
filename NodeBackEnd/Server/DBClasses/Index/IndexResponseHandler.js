var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ResponseHandler } from "../../Response/ResponseHandler.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
class IndexResponseHandler extends ResponseHandler {
    constructor(DbController, User, io) {
        super(DbController, User, io, { ClassName: "Index", TableName: "Index" });
    }
    Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.User.LoginAttempt(req, res, req.body.email, req.body.password);
            if (req.session.loggedin) {
                req.session.PageState.CurrentRenderTarget = "DataBaseSelection";
                this._Get(req, res);
            }
            else {
                this.RenderLogin(req, res, true);
            }
        });
    }
    Logout(req, res) {
        req.session.loggedin = false;
        req.session.save();
        //req.session.destroy();
        //this.RenderLogin(req, res);
    }
    RenderLogin(req, res, LoginFailed = false) {
        var BuildRenderTarget = `pages/index`;
        var PageState = {
            CurrentRenderTarget: "index",
            Title: "Database",
            _Action: "/",
        };
        var PageData = {
            ProductList: [],
            AllowedActions: {
                Delete: false,
                Update: false,
                Create: false,
                ViewLogs: false
            },
            LoginFailed: LoginFailed
        };
        res.render(BuildRenderTarget, { PageState: PageState, Data: PageData }, function (err, html) {
            if (err) {
                console.log(err);
                try {
                    res.sendFile(__dirname + "../../../public/404.html");
                }
                catch (e) {
                    res.send("ERROR");
                    console.log(e);
                }
            }
            else {
                res.status(200).send(html);
            }
        });
    }
    // Override for _Get. This uses PageData from the class
    _Get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.RenderPage(req, res); //Render the page
        });
    }
    _Post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.RenderPage(req, res);
        });
    }
}
export { IndexResponseHandler };
