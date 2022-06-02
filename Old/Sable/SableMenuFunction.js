const Log = require("../Logger");
const MasterLogger = require("../MasterLogger");


class SableMenu{
    /**
     * 
     * @param {MasterLogger} MLogger 
     */
    constructor(MLogger){
        const LookUp = {
            Base:0,
            All:1,
            Brand:2,
            Color:3
        }
        this.lookUpTable = LookUp;
        this.currentlySearch = false;
        this._Log = new Log(MLogger, "Filter");
    }

    /*
    * The Structure for this is as follows: Prefer error checks, preform filtering, either return filtered list or go to next function
    * for deeper filtering. Filtering level is dependant on the lookUpTable.
    */

/* ---------------------------------------------------------------------------------------------------------------------------------------------------- */

    /*
    * This function Checks for errors and then checks to see if we looking for base product items.
    * if we are looking for base product items then find all products without '-' and add them to the array
    */
    #ReturnBaseProduct(LookUp, ItemList, Query, Color){
        if(ItemList.length == 0){ // If there is nothing inside the array or its not a array return undefined
            return undefined;
        }
        if(LookUp != this.lookUpTable.Base){ //If We arent looking for the base SKU go to the next function
            return this.#ReturnAllProductsFromBase(LookUp, ItemList, Query, Color);
        }
        this._Log.New("Filtering Base Items");
        var CopyArray = [];
       
        for(var _node in ItemList){ // Find the Base Products to display
            if(!ItemList[_node].id.includes("-")){
                CopyArray.push(ItemList[_node]);
            }
        }
        this._Log.New(`Found: ${CopyArray.length} items`);
        return CopyArray;
    }

    /*
    * This function is a little bit more complicated do to the different levels of filtering needed to be checked for
    * If we are looking for something based on search results then push everything that matches the search query. This will most likely be expanded upon
    * If we are looking for all products for a specific sku then we need to filter for duplicate SKU's
    *  else add everything we find to the list that isn't a base product item.
    */
    #ReturnAllProductsFromBase(LookUp, ItemList, Query, Color){
        this._Log.New("Filtering All Products from base");
        var CopyArray = [];
        //If We are finding by id then add only the results that match to itemarray
        for(var _node in ItemList){
            var Duplicate = false;
            if(ItemList[_node].id.includes(Query)){//If we are looking for a specfic search change the behavior
                this._Log.New("Filtering based on Search");
                if(this.currentlySearch){
                    CopyArray.push(ItemList[_node]);
                }else{
                    if(ItemList[_node].brand != "Base"){ //Filter items that have the word base
                        if(LookUp == this.lookUpTable.All){//Check if we are looking for brand or colors
                            CopyArray.forEach((item) => { //Make sure there is no duplicates if we arent looking for colors
                                if(item.id == ItemList[_node].id){
                                    Duplicate = true;
                                }    
                            });
                            if(!Duplicate){
                                CopyArray.push(ItemList[_node]);
                            }
                        }else{
                            CopyArray.push(ItemList[_node]);//If we are looking for something other than brand then just push all Brands to the array
                        }
                    }
                }
            }
        }
        this.currentlySearch = false; //We have to make sure we set currentlySearch to false so it only preforms a search this one time
        if(LookUp != this.lookUpTable.All){
            CopyArray = this.#ReturnBrandProduct(LookUp, CopyArray, Query, Color);
        }
        this._Log.New(`Found: ${CopyArray.length} Items`);
        return CopyArray;
    }
    /*
    *   This is way more simple.
    *   Check if the filtered list has anything with the "-" Tag as it is a Brand product and return that
    *   Everything in itemlist is already filtered from the previous function so this just adds a layer on top of that
    */
    #ReturnBrandProduct(LookUp, ItemList, Query, Color){ //Return all filtered products that have "-" meaning they are brand products
        this._Log.New("Filtering By Selected Brand");
        var CopyArray = [];
        for(var _node in ItemList){
            if(ItemList[_node].brand.includes(ItemList[_node].id.split("-")[0])){
                CopyArray.push(ItemList[_node]);
            }
        }
        if(LookUp != this.lookUpTable.Brand){
            CopyArray = this.#ReturnColorProduct(LookUp, CopyArray, Query, Color);
        }
        this._Log.New(`Found: ${CopyArray.length} Items`);
        return CopyArray;
    }
    /*
    *   Simply return the SKU with the request color
    */
    #ReturnColorProduct(LookUp, ItemList, Query, Color){ // Return all filtered products based on color
        this._Log.New("Selecting Product by Color");
        if(LookUp != this.lookUpTable.Color){
            return undefined;
        }
        var CopyArray = [];
        for(var _node in ItemList){
            if(ItemList[_node].color.includes(Color)){
                CopyArray.push(ItemList[_node]);
            }
        }
        this._Log.New(`Found Product: ${JSON.stringify(CopyArray)}`);
        return CopyArray;
    }
    /*
    *   This is the entry point for all List Calls so functions can't be called out of order.
    *   This makes sure that the list gets properly sorted by each layer
    *   Base filter, all filter, brand filter, color filter
    */
    ReturnItemList(LookUp, ItemList, Query, Color){
        this._Log.New(`Starting Search for product in LookUp: ${LookUp} - Query: ${Query} - Color: ${Color}`);
        if(ItemList.length == 0){
            return [];
        }
        var List =  this.#ReturnBaseProduct(LookUp, ItemList, Query, Color);
        this._Log.New(`Found: ${List.length} Items`);
        return List;
    }

}


module.exports = SableMenu;