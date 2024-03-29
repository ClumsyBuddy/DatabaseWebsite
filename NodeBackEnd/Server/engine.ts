import {DatabaseManager} from "../Sockets/ServerGlobals.js";

import {readFileSync, watchFile} from "fs";
import { ItemData } from "./Response/ItemData.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { io } from "../Sockets/ServerGlobals.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ^^^ Used to get __dirname for parsejson. Need to look into a possibly more widespread solution

 export default class Engine{
    protected Stores:{
        ClassAutoColumn?:string,
        CACIndex?:number,
        DBController:any,
        ItemDataArray:Array<ItemData>
        [k:string]:any
    };
    protected DBController: DatabaseManager;
    private Engine_Start_Finish: boolean;
    

    



    constructor(_DBController, _stores:any){
        this.DBController = _DBController;
        this.Stores = _stores;
        this.Engine_Start_Finish = false;
        Object.keys(this.Stores).forEach((Name, i) => {
           //console.log(Name);
            //console.log(this.Stores[Name]);
            this.Stores[Name].ItemDataArray = [];
            this.Stores[Name].ItemOptions = [];
            this.Stores[Name].ItemTypes = [];
            this.Stores[Name].Items = [];
            this.Stores[Name].Columns = [];

            this.ParseJson(`/Config/${Name}Options.json`, this.UpdateItemInformation.bind(this), Name);
            this.ParseJson(`/Config/${Name}Brands.json`, (newValue:any) => {
                if(newValue.brands === undefined){
                    this.Stores[Name].brands = [];
                    return;
                }
                this.Stores[Name].brands = newValue.brands;
            }, Name);
            //console.log(this.Stores[Name].brands);
        });
        
        this.Engine_Start_Finish = true;
    }
    

    public ItemData(Name:string) : Array<ItemData>{
        //console.log(Name);
        return this.Stores[Name].ItemDataArray;
    }
    public getBrands(Name:string) : any{
        return this.Stores[Name].brands;
    }


    /*
    *   Called in constructor of child class. Starts the watch event for the file
    *   Calls a callback to handle changes to file
    */
    private ParseJson(FilePath:string, callback:Function, db_Name:string) : void{
        let ParsedData: any;
        try{
            let rawdata = readFileSync(__dirname + FilePath);
            ParsedData = JSON.parse(rawdata.toString());
            callback(ParsedData, db_Name);
        }catch(e){
            console.log(`Error: ${e} | @${__dirname + FilePath}`);
            return;
        }
        watchFile(__dirname + FilePath, {
            bigint: false,
            persistent: true,
            interval: 500,
            },(curr, prev) => { //Watches specfied file
            try{
                console.log("File Changed", __dirname + FilePath);
                let rawdata = readFileSync(__dirname + FilePath);
                let ParsedData = JSON.parse(rawdata.toString());
                callback(ParsedData, db_Name); //Callback to handle changes after
            }catch(e){
                console.log(`Error: ${e} | @${__dirname + FilePath}`);
            }
        })
    }

    /*
    *   This Function Does a few things
    *   1. This function gets the different item types and Options
    *   2. It gets all current columns if there is any, it then checks to see if the there are any new items that need to be added
    *   3. It then builds the strings that need to be added together and the ItemData objects
    *   4. Finally it either creates a new table or it doubles checkes these are new items and then updates the table
    */
    private UpdateItemInformation(newValue:any, Name:string){
        console.log("Name");
        this.Stores[Name].ItemDataArray = [];
        let AutoGeneratedClassColumn = this.Stores[Name].ClassAutoColumn === undefined ? "" : this.Stores[Name].ClassAutoColumn;
        if(newValue === undefined){
            return;
        }
        /*
        *   This Blob here Gets the Names of the Objects and the objects themselves
        */
        this.Stores[Name].Items = newValue;
        for(var _node in newValue){
            this.Stores[Name].ItemTypes = Object.keys(newValue);            
        }
        /*
        * Retrieve all Item Options
        */
        for(var Option in this.Stores[Name].Items){ //Got All Options
            if(typeof this.Stores[Name].Items[Option] === 'object'){            
                Object.keys(this.Stores[Name].Items[Option]).forEach((item) =>{
                    if(!this.Stores[Name].ItemOptions.includes(item)){
                        this.Stores[Name].ItemOptions.push(item);
                    }
                });
            }
        }
        /*
        *   Now I need to get all current columns
        *   Then check each column to see if it already has the option in it
        */
        this.DBController.getColumns(Name).then((result) => { //Got all new options that table didnt have previously
            var newItems : any[] = []; //Stores all new Item
            for(var i = 0; i < this.Stores[Name].ItemOptions.length; i++){
                var NewItem = true; //Boolean check for new items
                for(var j = 1+this.Stores[Name].CACIndex; j < result.length; j++){
                    if(this.Stores[Name].ItemOptions[i] == result[j].name){//If it is in the Table then continue;
                        NewItem = false;
                        continue;
                    } 
                    if(j == result.length - 1){ //If its the end of the loop and they arent equal
                        if(NewItem){ //And it is a new item
                            newItems.push(this.Stores[Name].ItemOptions[i]); //Add it to the list
                        }
                    }
                }
            }
            //console.log("New Items", newItems);
            if(newItems.length == 0){
                newItems = this.Stores[Name].ItemOptions;
            }
            /*
            *   Now I need To use the the full objects and parse it using the Itemtype and the Options it has to grab it's values
            *   I need to grab the values so I know what type the options are
            */
            var ColumnBuilder : string[] = [];
            ColumnBuilder.push(AutoGeneratedClassColumn); //Add the Class based column information
            for(var type in  this.Stores[Name].ItemTypes){ //Loop Through item types
                var CurrentItem = new ItemData(this.Stores[Name].ItemTypes[type]); //Initialize a new Item
                var Options : string[] = Object.keys(this.Stores[Name].Items[this.Stores[Name].ItemTypes[type]]) //Get all of the keys of the current item type
                for(var _node_one in Options){ //Loop through the Options found from the keys
                    var SavedValues : any = []; //Options Values will be stored temporarily in this array
                    for(var item in newItems){ //Loop through the newitem list 
                       if(Options[_node_one] == newItems[item]){ //Check if we found a new item
                            if(typeof this.Stores[Name].Items[this.Stores[Name].ItemTypes[type]][Options[_node_one]] == 'object'){ //If the item is a object
                                for(var values in this.Stores[Name].Items[this.Stores[Name].ItemTypes[type]][Options[_node_one]]){ //Loop through and get all of the variables from it
                                    SavedValues.push(this.Stores[Name].Items[this.Stores[Name].ItemTypes[type]][Options[_node_one]][values]); //Push the variables found to SavedValues
                                }
                            }else{
                                SavedValues.push(this.Stores[Name].Items[this.Stores[Name].ItemTypes[type]][Options[_node_one]]) //If its not a object push the values to savedValues
                            }
                            if(Number.isInteger(SavedValues[0])){ //Check if it is a number
                                ColumnBuilder.push(`${Options[_node_one]}`, `INTEGER`);
                            }else if(typeof SavedValues[0] == "string"){ //check if it is a string
                                ColumnBuilder.push(`${Options[_node_one]}`, `TEXT`);
                            }else if(typeof SavedValues[0] == 'boolean'){ //Check if it is a boolean
                                ColumnBuilder.push(`${Options[_node_one]}`, `INTEGER`);
                            }
                            CurrentItem.AddOptions(Options[_node_one], SavedValues); //Add the options to the Item
                        }
                    }
                }
                this.Stores[Name].ItemDataArray.push(CurrentItem); //Push the Item to the Itemdataarray and restart
            }

            this.Stores[Name].Column = ColumnBuilder; //Format for columnbuilder is: 0 = AutoGenerated SKU 1 = first Built column 2 = column definition 3 = second column 4 = column definition
            // so the to use columnbuild you need a for(let i = 1; i < ColumnBuilder.length; i += 2)
            // This alllows you to skip over the auto generated and access the columns. to get the deinitions you just need to add 1 to the index

            /*
            *   Build or Alter the Table with the options
            */
            var Dot = AutoGeneratedClassColumn == "" ? "" : ", ";
            var TableColumn = this.Stores[Name].Column[0];
            if(result.length == 0){ //If no table exist
                for(let i = 1; i < this.Stores[Name].Column.length; i += 2){
                    TableColumn += `${Dot}${this.Stores[Name].Column[i]} ${this.Stores[Name].Column[i+1]}`;
                }
                this.DBController.createTable(Name, Name, TableColumn).then((result)=> { //Create Sable Table
                })
            }else{ //If we are updating a existing table
                var newItemArray : any[] = [];
                    var Check = true;
                    for(let j = 0; j < newItems.length; j++){ //This section is just to double check these are new items, we will also need to find items to ..
                        for(let i = 1+this.Stores[Name].CACIndex; i < result.length; i++){ //    delete in the future
                        if(result[i].name == newItems[j]){
                            Check = false;
                            break;
                        }
                        if(i == result.length - 1){
                            if(Check == true){
                                var leave = false;
                                for(var item in newItemArray){
                                   if(newItemArray[item] === newItems[j]){
                                    leave = true;
                                   } 
                                }
                                if(leave){
                                    break;
                                }
                                newItemArray.push(newItems[j]);
                                }
                            }
                        }
                    }
                if(newItemArray.length > 0){
                    for(var item in newItemArray){
                        for(let i = 1; i < this.Stores[Name].Column.length; i += 2){
                            if(newItemArray[item] == this.Stores[Name].Column[i]){
                                 this.DBController.updateTable(Name, `${this.Stores[Name].Column[i]} ${this.Stores[Name].Column[i+1]}`);
                            }
                        }
                    }
                }
            }
            if(this.Engine_Start_Finish === true){
                io.emit("AddConfigUpdated", {NewData:this.Stores[Name].ItemDataArray});
            }
        });
        
    }
   
   
}

