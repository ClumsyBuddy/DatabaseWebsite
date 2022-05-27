
class SableMenu{
    constructor(){
        const LookUp = {
            Base:1,
            All:2,
            Brand:3,
            Color:4
        }
        this.lookUpTable = LookUp;

    }
    

    ReturnBaseProduct(LookUp, ItemList, Query){
        if(ItemList.length == 0 || Array.isArray(ItemList) == false){ // If there is nothing inside the array or its not a array return undefined
            return undefined;
        }
        if(LookUp != this.lookUpTable.Base){ //If We arent looking for the base SKU go to the next function
            return this.ReturnAllProductsFromBase(LookUp, ItemListm, Query, callback);
        }
        var CopyArray = [];
       
        for(var _node in result){ // Find the Base Products to display
            if(!result[_node].id.includes("-")){
                CopyArray.push(result[_node]);
            }
        }

        return CopyArray;

    }

    ReturnAllProductsFromBase(LookUp, CopyArray, Query){
        
        //If We are finding by id then add only the results that match to itemarray
        for(var _node in result){
            if(result[_node].id.includes(Query)){
                CopyArray.push(result[_node]);
            }
        }

        if(LookUp != this.lookUpTable.All){
            CopyArray = this.ReturnColorProduct(LookUp, CopyArray, Query, callback);
        }

        return CopyArray;
    }

    ReturnBrandProduct(LookUp, CopyArray, Query){
        
        for(var _node in result){
            if(result[_node].brand.includes(Query)){
                CopyArray.push(result[_node]);
            }
        }

        if(LookUp != this.lookUpTable.Brand){
            CopyArray = this.ReturnColorProduct(LookUp, CopyArray, Query, callback);
        }

        return CopyArray;
    }
    ReturnColorProduct(LookUp, CopyArray, Query, callback){
        if(LookUp != this.lookUpTable.Color){
            return undefined;
        }

        for(var _node in result){
            if(result[_node].color.includes(Query)){
                CopyArray.push(result[_node]);
            }
        }
        return CopyArray;
    }



}


module.exports = SableMenu;