import {DatabaseManager, Login} from "../../../Sockets/ServerGlobals.js";
import { ResponseHandler } from "../../Response/ResponseHandler.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { randomInt } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ^^^ Used to get __dirname for parsejson. Need to look into a possibly more widespread solution

class SableResponseHandler extends ResponseHandler{

    Name:string;
    Brands:Array<string>;
  
    constructor(DBController:DatabaseManager, User:typeof Login, name:string = "Sable", io){
        super(DBController, User, io, {ClassName:name, TableName:name, ClassAutoColumn:"sku TEXT, brand TEXT, itemtype TEXT, image TEXT", CACIndex:3});
        this.Name = name;
        let getBrands = function(ParsedData){this.Brands = ParsedData.brands;}
        this.ParseJson(__dirname + "/SableBrands.json", getBrands.bind(this));
        //Get item information from Jsonfile and create a watchfile event 
        this.ParseJson(__dirname + "/SableOptions.json", this.UpdateItemInformation.bind(this));

    }

    async MakeTestData(){
        for(let i = 0; i < 1000; i++){
            //this.DBController.create(this.Name, "sku, brand, itemtype", "?, ?, ?", [`SML${i}`, this.Brands[randomInt(this.Brands.length)], "Uniform"]);
        }
    }

}

export {SableResponseHandler};