import req from "express/lib/request";
import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import {ResponseHandler} from "../ResponseHandler";

class SableResponseHandler extends ResponseHandler{
    
    private PageData?:{
        ProductList?:Array<any>,
        AllowedActions?:any
    }

    Name:string;
    
    constructor(DBController:DatabaseManager, User:Login, name:string = "Sable"){
        super(DBController, User, name, name, "sku TEXT, brand TEXT, itemtype TEXT", 2);
        this.PageData = {
            ProductList: [],
            AllowedActions:{
                Delete:false,
                Update:false,
                Create:false,
                ViewLogs:false
            }
        }

        this.Name = name;

        //Get item information from Jsonfile and create a watchfile event 
        this.ParseJson("./Sable/SableOptions.json", this.UpdateItemInformation.bind(this));

        this.PageState.CurrentRenderTarget = "Sable";
    }


    
    public get Get_PageData() : any {
        return this.PageData;
    }

    async Start(req, res){
        await this.GetAllProducts(req, res, this.Name);
        this.PageData.AllowedActions = req.session.AllowedActions;
        this.PageData.ProductList = req.session.ProductList;
        this._Get(req, res);
    }

    async _Get(req, res, cb = undefined){
        if(cb){
            await cb(req, res); //You need to bind Sable to the callback to use "this"
        }
        this.RenderPage(req, res, this.PageData); //This is normally called at the end
    }
    async _Post(req, res, cb){
        if(cb){
            await cb(); //You need to bind Sable to the callback to use "this"
        }
        this.RenderPage(req, res, this.PageData); //This is normally called at the end
    }




}



export {SableResponseHandler};