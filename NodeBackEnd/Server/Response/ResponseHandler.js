var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Engine from "../engine.js";
//const fs = require('fs');
//TODO Need to implement responsive error handling so a single bug doesn't bring down the server
//     Try catch and using base state should be able to keep the server from crashing
//  https://stackoverflow.com/questions/34834151/how-to-catch-errors-when-rendering-ejs-view-node-js
// Possibly a good method of error handling
class ResponseHandler extends Engine {
    constructor(DBController, _stores = {}) {
        super(DBController, _stores);
    }
    ReturnSearchResults(Name, _Query = "") {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBController.getAll(Name).then((result) => {
                let ProductList = _Query === "" ? result : []; //If we have no query then we can just get all results
                if (ProductList.length == 0) { //This section checks any products options matches the Query
                    var FoundItemArray = [];
                    var Query = _Query.split(" ");
                    for (var item in result) {
                        var Match = 0;
                        for (var queries in Query) {
                            if (result[item].sku.toLowerCase().includes(Query[queries].toLowerCase()) || result[item].brand.toLowerCase().includes(Query[queries].toLowerCase())) {
                                Match++;
                                continue;
                            }
                            for (var Data in this.Stores[Name].ItemDataArray) {
                                var Options = this.Stores[Name].ItemDataArray[Data].Options;
                                for (var O in Options) {
                                    if (typeof Options[O] === 'object') {
                                        for (var i in Options[O]) {
                                            if (result[item][i] == null || result[item][i] == undefined) {
                                                continue;
                                            }
                                            var ResultString = result[item][i].toLowerCase();
                                            if (ResultString.includes(Query[queries].toLowerCase())) {
                                                Match++;
                                            }
                                        }
                                    }
                                    else {
                                        if (result[item][Options[O]] == null || result[item][Options[O]] == undefined) {
                                            continue;
                                        }
                                        if (result[item][Options[O]].toLowerCase().includes(Query[queries].toLowerCase())) {
                                            Match++;
                                        }
                                    }
                                }
                            }
                        }
                        if (Match == Query.length) {
                            FoundItemArray.push(result[item]);
                        }
                    }
                    for (let i = 0; i < FoundItemArray.length; i++) {
                        for (let j = 0; j < FoundItemArray.length; j++) {
                            if (i == j) {
                                continue;
                            }
                            if (FoundItemArray[i].key == FoundItemArray[j].key) {
                                FoundItemArray.splice(j, 1);
                            }
                        }
                    }
                    return FoundItemArray;
                }
                else {
                    return result;
                }
            });
        });
    }
    UpdateItem(Columns, Values, key, Name) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < Columns.length; i++) {
                yield this.DBController.update(Name, Columns[i], Values[i], key);
            }
            return yield this.GetItemById(Name, key);
        });
    }
    AddItem(ItemObject = {}, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.length === 0) {
                console.log("Empty Object"); //Double checking for any errors
                return;
            }
            if (!ItemObject.sku) {
                console.log("not SKU Given");
                return;
            }
            if (!ItemObject.brand) {
                console.log("No Brand Given");
                return;
            }
            let ItemAlreadyExist = yield this.DBController.getAll(name).then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (ItemObject.itemtype === "Uniform") {
                        if (result[i].sku === ItemObject.sku && result[i].brand === ItemObject.brand && result[i].color === ItemObject.Color) {
                            console.log("This already Exist");
                            return true;
                        }
                    }
                    else {
                        if (result[i].sku === ItemObject.sku && result[i].brand === ItemObject.brand) {
                            console.log("This already Exist");
                            return true;
                        }
                    }
                }
                return false;
            });
            if (ItemAlreadyExist === true) { //If the item already exist return
                return { ItemAlreadyExist: ItemAlreadyExist };
            }
            const keys = Object.keys(ItemObject); //Get all keys
            let QuestionMarkString = ""; //We need the question marks for the SQL query ei. (SELECT * FROM Sable WHERE id = ?)[parameters]
            for (let i = 0; i < keys.length; i++) {
                if (i === keys.length - 1) {
                    QuestionMarkString += "?";
                }
                else {
                    QuestionMarkString += "?,";
                }
            }
            let Columns = "";
            let Col_Values = [];
            keys.forEach((value, i) => {
                if (typeof ItemObject[value] === "string") {
                    Columns += value;
                    if (ItemObject[value][ItemObject[value].length - 1] === ",") {
                        ItemObject[value] = ItemObject[value].slice(0, ItemObject[value].length - 1);
                    }
                    Col_Values.push(ItemObject[value].replace(" ", ""));
                }
                else {
                    Columns += value.toString();
                    if (ItemObject[value][ItemObject[value].length - 1] === ",") {
                        ItemObject[value] = ItemObject[value].slice(0, ItemObject[value].length - 1);
                    }
                    Col_Values.push(ItemObject[value].toString());
                }
                if (i !== keys.length - 1) {
                    Columns += ","; //If we are not at the end add a comma between each column
                }
            });
            let id = yield this.DBController.create("Sable", Columns, QuestionMarkString, Col_Values); //Create the item and return the id (aka the key)
            return { id: id.id, ItemAlreadyExist: false }; //return the id and that the item didn't exist
        });
    }
    GetItemById(DB, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBController.getById(DB, id);
        });
    }
    DeleteItem(name, key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.DBController.delete(name, key);
            if ((yield this.DBController.getById(name, key)) === undefined) {
                return true;
            }
            return false;
        });
    }
    GetAllProducts(name, req) {
        return __awaiter(this, void 0, void 0, function* () {
            var ProductList = [];
            yield this.DBController.getAll(name).then((result) => {
                ProductList = result;
                if (req !== undefined) {
                    req.session.PageData.ProductList = ProductList;
                }
            });
            return ProductList;
        });
    }
}
export { ResponseHandler };
