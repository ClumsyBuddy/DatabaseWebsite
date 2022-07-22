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
class DiploResponseHandler extends ResponseHandler {
    constructor(DBController, User, io) {
        var Name = "Diplomat";
        super(DBController, User, io, { ClassName: Name, TableName: Name });
        //this.ItemInformation = this.ParseJson("./Diplomat/DiploOptions.json", this.UpdateItemInformation.bind(this));
        //this.DBController.createTable("Diplomat", "Diplomat", "id TEXT, itemtype TEXT"); //Create Diplomat Table
    }
    _Get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            req.session.CurrentRenderTarget = "Diplomat";
            this.RenderPage(req, res);
        });
    }
    _Post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.RenderPage(req, res);
        });
    }
}
export { DiploResponseHandler };
