import { DatabaseManager } from "../DatabaseManager";
import { Login } from "../LoginHandler";
import {ResponseHandler} from "../ResponseHandler";

const fs = require("fs")

class SableResponseHandler extends ResponseHandler{
    

    constructor(DBController:DatabaseManager, User:Login){
        var Name = "Sable";
        super(DBController, User, Name, Name);

        //Get item information from Jsonfile and create a watchfile event
        this.ItemInformation = this.ParseJson("./Sable/SableOptions.json", this.UpdateItemInformation.bind(this));
        
        //Now I need to parse the JSON object into useable columns and save the objects as itemtypes for later
        //Then I need to try and create the table with the columns
        //Then I need to parse the table if none was created and check if it has all of the columns
        //If it doesnt have all of the columns I need to insert the new columns
    
        
        this.DBController.createTable("Sable", "Sable", "id TEXT, brand TEXT"); //Create Sable Table
        this.PageState.CurrentRenderTarget = "Sable";
    
        
        
    }


    _Get(req, res, Data){
        console.log("Get Sable: " + JSON.stringify(this.ItemInformation));
        this.RenderPage(req, res, Data);
    }
    _Post(req, res){

    }




}



export {SableResponseHandler};