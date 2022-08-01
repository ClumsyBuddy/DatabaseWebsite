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
// ^^^ Used to get __dirname for parsejson. Need to look into a possibly more widespread solution
class SableResponseHandler extends ResponseHandler {
    constructor(DBController, User, name = "Sable", io) {
        super(DBController, User, io, { ClassName: name, TableName: name, ClassAutoColumn: "sku TEXT, brand TEXT, itemtype TEXT, image TEXT", CACIndex: 3 });
        this.Name = name;
        let getBrands = function (ParsedData) { this.Brands = ParsedData.brands; };
        this.ParseJson(__dirname + "/SableBrands.json", getBrands.bind(this));
        //Get item information from Jsonfile and create a watchfile event 
        this.ParseJson(__dirname + "/SableOptions.json", this.UpdateItemInformation.bind(this));
    }
    MakeTestData() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < 1000; i++) {
                //this.DBController.create(this.Name, "sku, brand, itemtype", "?, ?, ?", [`SML${i}`, this.Brands[randomInt(this.Brands.length)], "Uniform"]);
            }
        });
    }
}
export { SableResponseHandler };
