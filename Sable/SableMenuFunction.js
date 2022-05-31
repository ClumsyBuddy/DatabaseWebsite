
class SableMenu{
    constructor(){
        const LookUp = {
            Base:0,
            All:1,
            Brand:2,
            Color:3
        }
        this.lookUpTable = LookUp;
        this.currentlySearch = false;
    }
    #ReturnBaseProduct(LookUp, ItemList, Query, Color){
        if(ItemList.length == 0){ // If there is nothing inside the array or its not a array return undefined
            return undefined;
        }
        if(LookUp != this.lookUpTable.Base){ //If We arent looking for the base SKU go to the next function
            return this.#ReturnAllProductsFromBase(LookUp, ItemList, Query, Color);
        }
        var CopyArray = [];
       
        for(var _node in ItemList){ // Find the Base Products to display
            if(!ItemList[_node].id.includes("-")){
                CopyArray.push(ItemList[_node]);
            }
        }
        return CopyArray;
    }
    #ReturnAllProductsFromBase(LookUp, ItemList, Query, Color){
        var CopyArray = [];
        //If We are finding by id then add only the results that match to itemarray
        for(var _node in ItemList){
            if(ItemList[_node].id.includes(Query)){
                if(this.currentlySearch){
                    CopyArray.push(ItemList[_node]);
                }else{
                    if(ItemList[_node].brand != "Base"){
                        CopyArray.push(ItemList[_node]);
                    }
                }
            }
        }
        this.currentlySearch = false;
        if(LookUp != this.lookUpTable.All){
            CopyArray = this.#ReturnBrandProduct(LookUp, CopyArray, Query, Color);
        }

        return CopyArray;
    }
    #ReturnBrandProduct(LookUp, ItemList, Query, Color){
        var CopyArray = [];
        for(var _node in ItemList){
            if(ItemList[_node].brand.includes(ItemList[_node].id.split("-")[0])){
                CopyArray.push(ItemList[_node]);
            }
        }
        if(LookUp != this.lookUpTable.Brand){
            CopyArray = this.#ReturnColorProduct(LookUp, CopyArray, Query, Color);
        }
        return CopyArray;
    }

    #ReturnColorProduct(LookUp, ItemList, Query, Color){
        if(LookUp != this.lookUpTable.Color){
            return undefined;
        }
        var CopyArray = [];
        for(var _node in ItemList){
            if(ItemList[_node].color.includes(Color)){
                CopyArray.push(ItemList[_node]);
            }
        }
        return CopyArray;
    }

    ReturnItemList(LookUp, ItemList, Query, Color){
        if(ItemList.length == 0){
            return [];
        }
        var List =  this.#ReturnBaseProduct(LookUp, ItemList, Query, Color);
        return List;
    }

}


module.exports = SableMenu;