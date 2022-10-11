import { ItemData } from "./ItemData.js";
import Engine from "../engine.js";
import {DatabaseManager, Login} from "../../Sockets/ServerGlobals.js";
//const fs = require('fs');

//TODO Need to implement responsive error handling so a single bug doesn't bring down the server
//     Try catch and using base state should be able to keep the server from crashing
//  https://stackoverflow.com/questions/34834151/how-to-catch-errors-when-rendering-ejs-view-node-js
// Possibly a good method of error handling
class  ResponseHandler extends Engine{
    
    constructor(DBController: DatabaseManager, _stores:{} = {}){
        super(DBController, _stores);
    }

    async ReturnSearchResults(Name, _Query : string = ""){
        return await this.DBController.getAll(Name).then((result) => {
            let ProductList = _Query === "" ? result : []; //If we have no query then we can just get all results
            if(ProductList.length == 0){ //This section checks any products options matches the Query
                var FoundItemArray : any[] = [];
                var Query : string[] = _Query.split(" ");

                for(var item in result){
                    var Match = 0;
                    for(var queries in Query){
                        if(result[item].sku.toLowerCase().includes(Query[queries].toLowerCase()) || result[item].brand.toLowerCase().includes(Query[queries].toLowerCase())){
                            Match++;
                            continue;
                        }
                        for(var Data in this.Stores[Name].ItemDataArray){
                            var Options = this.Stores[Name].ItemDataArray[Data].Options;
                            for(var O in Options){
                                if(typeof Options[O] === 'object'){
                                    for(var i in Options[O]){
                                        if(result[item][i] == null || result[item][i] == undefined){
                                            continue;
                                        }
                                        var ResultString : string = result[item][i].toLowerCase();
                                        if(ResultString.includes(Query[queries].toLowerCase())){
                                            Match++;
                                        }
                                    }
                                }else{
                                    if(result[item][Options[O]] == null || result[item][Options[O]] == undefined){
                                        continue;
                                    }
                                    if(result[item][Options[O]].toLowerCase().includes(Query[queries].toLowerCase())){
                                        Match++;
                                    }
                                }
                                
                            }
                        }
                    }
                    if(Match == Query.length){
                        FoundItemArray.push(result[item]);
                    }
                }                    
                for(let i = 0; i < FoundItemArray.length; i++){
                    for(let j = 0; j < FoundItemArray.length; j++){
                        if(i == j){
                            continue;
                        }
                        if(FoundItemArray[i].key == FoundItemArray[j].key){
                            FoundItemArray.splice(j, 1);
                        }
                    }
                }
                return FoundItemArray;
            }else{
                return result;
            }
        });
    }


    async UpdateItem(Columns:Array<string>, Values:Array<string>, key:number, Name:string){
        for(let i = 0; i < Columns.length; i++){
            await this.DBController.update(Name, Columns[i], Values[i],  key);
        }
        return await this.GetItemById(Name, key);
    }

    async AddItem(ItemObject: {[k:string]: any}={}, name:string){

        if(Object.length === 0){
            console.log("Empty Object"); //Double checking for any errors
            return;
        }if(!ItemObject.sku){
            console.log("not SKU Given");
            return;
        }if(!ItemObject.brand){
            console.log("No Brand Given");
            return;
        }
         let ItemAlreadyExist = await this.DBController.getAll(name).then((result) => { //Get all current items to check if it exists already
           for(let i = 0; i < result.length; i++){
                if(ItemObject.itemtype === "Uniform"){
                    if(result[i].sku === ItemObject.sku && result[i].brand === ItemObject.brand && result[i].color === ItemObject.Color){
                        console.log("This already Exist");
                        return true;
                    }    
                }else{
                    if(result[i].sku === ItemObject.sku && result[i].brand === ItemObject.brand){
                        console.log("This already Exist");
                        return true;
                    }
                }
           }
           return false;
        });
        if(ItemAlreadyExist === true){ //If the item already exist return
            return {ItemAlreadyExist: ItemAlreadyExist};
        }
        const keys = Object.keys(ItemObject); //Get all keys
        let QuestionMarkString = ""; //We need the question marks for the SQL query ei. (SELECT * FROM Sable WHERE id = ?)[parameters]
        for(let i = 0; i < keys.length; i++ ){
            if(i === keys.length-1){
                QuestionMarkString += "?";
            }else{
                QuestionMarkString += "?,";
            }
        }
        let Columns = "";
        let Col_Values = [];
        keys.forEach((value, i) => { //Go over the keys and values, check if its a string. If its not convert it to a string
            if(typeof ItemObject[value] === "string"){
                Columns += value;
                if(ItemObject[value][ItemObject[value].length - 1] === ","){
                    ItemObject[value] = ItemObject[value].slice(0, ItemObject[value].length-1);
                }
                Col_Values.push(ItemObject[value].replace(" ", ""));
            }else{
                Columns += value.toString();
                if(ItemObject[value][ItemObject[value].length - 1] === ","){
                    ItemObject[value] = ItemObject[value].slice(0, ItemObject[value].length-1);
                }
                Col_Values.push(ItemObject[value].toString());
            }
            if(i !== keys.length-1){
                Columns += ","; //If we are not at the end add a comma between each column
            }
        });
        let id = await this.DBController.create("Sable", Columns, QuestionMarkString, Col_Values); //Create the item and return the id (aka the key)
        return {id:id.id, ItemAlreadyExist:false}; //return the id and that the item didn't exist
    }

    async GetItemById(DB:string, id:number){
        return await this.DBController.getById(DB, id);
    }

    async DeleteItem(name:string, key:number){
        await this.DBController.delete(name, key)
        if(await this.DBController.getById(name, key) === undefined){
            return true;
        }
        return false;
    }

    async GetAllProducts(name:string, req?:any){
        var ProductList = [];
        await this.DBController.getAll(name).then((result) => {
            ProductList = result;
            if(req !== undefined){
                req.session.PageData.ProductList = ProductList;
            }
        });
        return ProductList;
    }

    


    // /*
    // *   This Function Does a few things
    // *   1. This function gets the different item types and Options
    // *   2. It gets all current columns if there is any, it then checks to see if the there are any new items that need to be added
    // *   3. It then builds the strings that need to be added together and the ItemData objects
    // *   4. Finally it either creates a new table or it doubles checks these are new items and then updates the table
    // */
    // async UpdateItemInformation(newValue:any){
    //     this.ItemDataArray = [];
    //     if(newValue === undefined){
    //         return;
    //     }
    //     /*
    //     *   This Blob here Gets the Names of the Objects and the objects themselves
    //     */
    //     this.Items = newValue;
    //     for(var _node in newValue){
    //         this.ItemTypes = Object.keys(newValue);            
    //     }
    //     /*
    //     * Retrieve all Item Options
    //     */
    //     for(var Option in this.Items){ //Got All Options
    //         if(typeof this.Items[Option] === 'object'){            
    //             Object.keys(this.Items[Option]).forEach((item) =>{
    //                 if(!this.ItemOptions.includes(item)){
    //                     this.ItemOptions.push(item);
    //                 }
    //             });
    //         }
    //     }
    //     /*
    //     *   Now I need to get all current columns
    //     *   Then check each column to see if it already has the option in it
    //     */
    //     this.DBController.getColumns(this.TableName).then((result) => { //Got all new options that table didn't have previously
    //         var newItems : any[] = []; //Stores all new Item
    //         for(var i = 0; i < this.ItemOptions.length; i++){
    //             var NewItem = true; //Boolean check for new items
    //             for(var j = 1+this.CACIndex; j < result.length; j++){
    //                 if(this.ItemOptions[i] == result[j].name){//If it is in the Table then continue;
    //                     NewItem = false;
    //                     continue;
    //                 } 
    //                 if(j == result.length - 1){ //If its the end of the loop and they aren't equal
    //                     if(NewItem){ //And it is a new item
    //                         newItems.push(this.ItemOptions[i]); //Add it to the list
    //                     }
    //                 }
    //             }
    //         }
    //         if(newItems.length == 0){
    //             newItems = this.ItemOptions;
    //         }
    //         /*
    //         *   Now I need To use the the full objects and parse it using the Itemtype and the Options it has to grab it's values
    //         *   I need to grab the values so I know what type the options are
    //         */
    //         var ColumnBuilder : string[] = [];
    //         ColumnBuilder.push(this.AutoGeneratedClassColumn); //Add the Class based column information
    //         for(var type in  this.ItemTypes){ //Loop Through item types
    //             var CurrentItem = new ItemData(this.ItemTypes[type]); //Initialize a new Item
    //             var Options : string[] = Object.keys(this.Items[this.ItemTypes[type]]) //Get all of the keys of the current item type
    //             for(var _node_one in Options){ //Loop through the Options found from the keys
    //                 var SavedValues : any = []; //Options Values will be stored temporarily in this array
    //                 for(var item in newItems){ //Loop through the newitem list 
    //                    if(Options[_node_one] == newItems[item]){ //Check if we found a new item
    //                         if(typeof this.Items[this.ItemTypes[type]][Options[_node_one]] == 'object'){ //If the item is a object
    //                             for(var values in this.Items[this.ItemTypes[type]][Options[_node_one]]){ //Loop through and get all of the variables from it
    //                                 SavedValues.push(this.Items[this.ItemTypes[type]][Options[_node_one]][values]); //Push the variables found to SavedValues
    //                             }
    //                         }else{
    //                             SavedValues.push(this.Items[this.ItemTypes[type]][Options[_node_one]]) //If its not a object push the values to savedValues
    //                         }
    //                         if(Number.isInteger(SavedValues[0])){ //Check if it is a number
    //                             ColumnBuilder.push(`${Options[_node_one]}`, `INTEGER`);
    //                         }else if(typeof SavedValues[0] == "string"){ //check if it is a string
    //                             ColumnBuilder.push(`${Options[_node_one]}`, `TEXT`);
    //                         }else if(typeof SavedValues[0] == 'boolean'){ //Check if it is a boolean
    //                             ColumnBuilder.push(`${Options[_node_one]}`, `INTEGER`);
    //                         }
    //                         CurrentItem.AddOptions(Options[_node_one], SavedValues); //Add the options to the Item
    //                     }
    //                 }
    //             }
    //             this.ItemDataArray.push(CurrentItem); //Push the Item to the Itemdataarray and restart
    //         }
    //         this.Column = ColumnBuilder; //Format for columnbuilder is: 0 = AutoGenerated SKU 1 = first Built column 2 = column definition 3 = second column 4 = column definition
    //         // so the to use columnbuild you need a for(let i = 1; i < ColumnBuilder.length; i += 2)
    //         // This alllows you to skip over the auto generated and access the columns. to get the deinitions you just need to add 1 to the index

    //         /*
    //         *   Build or Alter the Table with the options
    //         */
    //         var Dot = this.AutoGeneratedClassColumn == "" ? "" : ", ";
    //         var TableColumn = this.Column[0];
    //         if(result.length == 0){ //If no table exist
    //             for(let i = 1; i < this.Column.length; i += 2){
    //                 TableColumn += `${Dot}${this.Column[i]} ${this.Column[i+1]}`;
    //             }
    //             this.DBController.createTable(this.TableName, this.ClassName, TableColumn).then((result)=> { //Create Sable Table
    //             })
    //         }else{ //If we are updating a existing table
    //             var newItemArray : any[] = [];
    //                 var Check = true;
    //                 for(let j = 0; j < newItems.length; j++){ //This section is just to double check these are new items, we will also need to find items to ..
    //                     for(let i = 1+this.CACIndex; i < result.length; i++){ //    delete in the future
    //                     if(result[i].name == newItems[j]){
    //                         Check = false;
    //                         break;
    //                     }
    //                     if(i == result.length - 1){
    //                         if(Check == true){
    //                             var leave = false;
    //                             for(var item in newItemArray){
    //                                if(newItemArray[item] === newItems[j]){
    //                                 leave = true;
    //                                } 
    //                             }
    //                             if(leave){
    //                                 break;
    //                             }
    //                             newItemArray.push(newItems[j]);
    //                             }
    //                         }
    //                     }
    //                 }
    //             if(newItemArray.length > 0){
    //                 for(var item in newItemArray){
    //                     for(let i = 1; i < this.Column.length; i += 2){
    //                         if(newItemArray[item] == this.Column[i]){
    //                              this.DBController.updateTable(this.TableName, `${this.Column[i]} ${this.Column[i+1]}`);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     })
    // }
   
}

export {ResponseHandler};