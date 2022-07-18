import { DatabaseManager } from "../../Database/DatabaseManager";
import { Login } from "../Login/LoginHandler";
import {ResponseHandler} from "../../Response/ResponseHandler";
import { ItemData } from "../../Response/ItemData";

class SableResponseHandler extends ResponseHandler{

    Name:string;
    Brands:Array<string>;
    constructor(DBController:DatabaseManager, User:Login, name:string = "Sable", io){
        super(DBController, User, io, {ClassName:name, TableName:name, ClassAutoColumn:"sku TEXT, brand TEXT, itemtype TEXT, image TEXT", CACIndex:3});
        this.Name = name;
        this.Brands = ["CLA", "CLAP", "COM", "COMCOS", "SBN", "EVH", "ASC", "MST", "WDS", "CAM",
                        "ECO", "QUA", "ROD", "SLP"];
        //Get item information from Jsonfile and create a watchfile event 
        this.ParseJson(__dirname + "/SableOptions.json", this.UpdateItemInformation.bind(this));

        
    }

    
    public get ItemData() : Array<ItemData> {
        return this.ItemDataArray;
    }
    

    async MakeTestData(){
        for(let i = 0; i < 5056; i++){
            await this.DBController.create("Sable", "sku, brand, itemtype, Color, Size", "?, ?, ?, ?, ?", ["SML" + i, "CLA", "Uniform", "NA", "XL"]);
        }
    }


    async Start(req, res){
        //await this.GetAllProducts(this.Name, req);
        this._Get(req, res);
    }

    async _Get(req, res, cb : Function = ()=>{return;}){
        req.session.PageState.CurrentRenderTarget = "Sable";
        if(cb){
            await cb(req, res); //You need to bind Sable to the callback to use "this"
        }
        this.RenderPage(req, res); //This is normally called at the end
    }
    async _Post(req, res, cb : Function = ()=>{return;}){
        if(cb){
            await cb(); //You need to bind Sable to the callback to use "this"
        }
        this.RenderPage(req, res); //This is normally called at the end
    }




}



export {SableResponseHandler};