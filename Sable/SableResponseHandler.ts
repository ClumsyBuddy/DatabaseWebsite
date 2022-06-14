import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import {ResponseHandler} from "../ResponseHandler";

class SableResponseHandler extends ResponseHandler{
    
    private PageData?:{
        ProductList?:Array<any>
    }

    Name:string;
    
    constructor(DBController:DatabaseManager, User:Login, name:string = "Sable"){
        super(DBController, User, name, name, "sku TEXT, brand TEXT, itemtype TEXT", 2);
        this.PageData = {
            ProductList: []
        }

        this.Name = name;
        // TODO Rework SableOptions.json - Needs to be easier to parse. All options need to be Second layer at most
        // The Options different values need to be third layer only

        //Get item information from Jsonfile and create a watchfile event 
        this.ParseJson("./Sable/SableOptions.json", this.UpdateItemInformation.bind(this));

        //Now I need to parse the JSON object into useable columns and save the objects as itemtypes for later
        //Then I need to try and create the table with the columns
        //Then I need to parse the table if none was created and check if it has all of the columns
        //If it doesnt have all of the columns I need to insert the new columns
        this.PageState.CurrentRenderTarget = "Sable";
    }

    async GetAllProducts(){
        await this.DBController.getAll(this.Name).then((result) => {
            for(var e_result in result){
                var dup = false;
                for(var p_result in this.PageData.ProductList){
                    if(result[e_result].key == this.PageData.ProductList[p_result].key){
                        dup = true;
                        break;
                    }
                }
                if(dup){
                    continue;
                }
                this.PageData.ProductList = result;
            }
        });
    }

    async _Get(req, res, cb){
        if(cb){
            await cb(); //You need to bind Sable to the callback to use "this"
        }
        this.RenderPage(req, res, this.PageData); //This is normally called at the end
    }
    async _Post(req, res){
        this.RenderPage(req, res, this.PageData); //This is normally called at the end
    }




}



export {SableResponseHandler};