const Log = require("./Logger");
const MasterLogger = require("./MasterLogger");
const Products = require("./Products");
const SableMenu = require("./Sable/SableMenuFunction");
const SablePageState = require("./Sable/SableState");


class  ResponseHandler{
    /**
     * @param {Products} PControl
     * @param {MasterLogger} _Logger
     */
    constructor(MainIndex, PControl, _Logger){
        this.FrontPage = MainIndex;
        
        this.PControl = PControl;
        this.MLogger = _Logger
        this.ProductLog = new Log(this.MLogger, "PHandle");
        this.PreviousRequest = undefined;
        }

    RenderAll(req, res, Data, callback){
            this.PControl.getAll().then((result) => {
                var ItemArray = [];
                //If the result array is empty push result into the array otherwise make itemarray equal to result
                if(Array.isArray(result) == false){ 
                    this.ProductLog.New("Could not find array of items \n Creating new array"); 
                    ItemArray.push(result);
                }else{
                    this.ProductLog.New("Grabbing All Items");
                    ItemArray = result;
                }
                if(callback != undefined && Data.DisplayProductList){
                    ItemArray = callback.ReturnItemList(Data.FindProducts, ItemArray, Data.Query, Data.Optional);
                }
                Data.ProductList = ItemArray;
                this.ProductLog.New("Rendering Items");

                if(Data.ProductList.length == 0){
                    Data.SectionId = "Database is Empty";
                }

                res.render(Data.PageToRender, {Data});
            })
    }

    #AddProduct(req, res, postMessage){
        this.ProductLog.New(`Attempting to Add: [${postMessage.id} | ${postMessage.Brand} | ${postMessage.Color}]`);
        var CSizes = "";
        for(var Sizes in postMessage.CheckBox){
            if(Sizes == postMessage.CheckBox.length - 1){
                CSizes += postMessage.CheckBox[Sizes];
            }else{
                CSizes += postMessage.CheckBox[Sizes] + ",";
            }
        }
        this.PControl.getAll().then((result) => {
            var _id = postMessage.id.replaceAll(" ", "");
            if(result.length == 0){
                this.PControl.create(_id, "Base", "Base", "Base", "Base", "Base");
                this.PControl.create(`${postMessage.Brand}-${_id}`, postMessage.Brand, postMessage.Color, CSizes, postMessage.Active_Product, postMessage.Description);
                return;
            }
            var Data = {
                Brand_Id: `${postMessage.Brand}-${_id}`,
                Base: false,
                Duplicate_Id: false,
                Duplicate_Color: false
            }
            for(var key in result){
                if(result[key].id == _id){
                    Data.Base = true;
                }
                if(result[key].id == Data.Brand_Id){
                    Data.Duplicate_Id = true;
                    if(result[key].color == postMessage.Color){
                        Data.Duplicate_Color = true;
                        this.ProductLog.New(`Duplicate Result: [${Data.Brand_Id} | ${postMessage.Brand} | ${postMessage.Color}] was not added`);
                    }
                }  
            }
            if(Data.Base == false){
                this.PControl.create(_id, "Base", "Base", "Base", "Base", "Base");
                this.ProductLog.New(`Successfully added base: [${postMessage.id}]`);
            }
            if(Data.Duplicate_Id == false){
                this.PControl.create(Data.Brand_Id, postMessage.Brand, postMessage.Color, CSizes, postMessage.Active_Product, postMessage.Description);
                this.ProductLog.New(`Successfully added: [${Data.Brand_Id} | ${postMessage.Brand} | ${postMessage.Color}]`);
            }
            if(Data.Duplicate_Id == true && Data.Duplicate_Color == false){
                this.PControl.create(Data.Brand_Id, postMessage.Brand, postMessage.Color, CSizes, postMessage.Active_Product, postMessage.Description);
                this.ProductLog.New(`Successfully added Color: [${Data.Brand_Id} | ${postMessage.Brand} | ${postMessage.Color}]`);
            }
        });
    }

    async #DeleteProduct(req, res, postMessage, _SableState, SableMenu){
        let PreFormatted = postMessage._Delete.split(" "); //Split Query by the spaces
        var Formatted = [];
        for(var _node in  PreFormatted){ //Loop through and dont add blank spaces
            if(PreFormatted[_node] == ""){
                continue;
            }
            Formatted.push(PreFormatted[_node]);
        }
        this.ProductLog.New(`Deleting: [${postMessage._Delete}]`);
        await this.PControl.getAll().then((result)=>{//Get All Products, await for this this promise to resolve before rendering the screen
            for(var Item in result){ //Get All Items
                if(result[Item].id == Formatted[0] && result[Item].brand == Formatted[1] && result[Item].color == Formatted[2]){ //Check if the current item is what we are looking for
                    this.PControl.delete(result[Item].key).then(() => { //Delete the item using the auto incremented key
                    this.PControl.getAll().then((result) => { //Get the new list of items in db
                            var Items = [];
                            for(var _node in result){ //Loop Through the items and look for everything by SKU without brand
                                if(result[_node].id.includes(Formatted[0].split("-").pop())){
                                    Items.push(result[_node]);
                                }
                            }
                            if(Items.length == 1){ //If the items without brand and only SKU is only one we can assume its a base item
                                if(Items[0].brand == "Base"){ //If it is infact a base item
                                    this.ProductLog.New("No remaining Products with SKU, Deleting Base");
                                    this.PControl.delete(Items[0].key); //Delete it
                                }
                            }
                        })
                    })
                    break;
                }
            }
            
        })
        _SableState.HandleMenuPost(_SableState.IndexTable._ReRender, postMessage, SableMenu); //Setup Menu State
        this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu); //Render new menu state with new items
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {SablePageState} _SableState 
     * @param {Object} NewData 
     */
    #UpdateProduct(req, res, _SableState, postMessage, SableMenu){
        this.PControl.getAll().then((result) =>{
            var CSizes = "";
            for(var Sizes in postMessage.CheckBox){
                if(Sizes == postMessage.CheckBox.length - 1){
                    CSizes += postMessage.CheckBox[Sizes];
                }else{
                    CSizes += postMessage.CheckBox[Sizes] + ",";
                }
            }
            var MultipleSKU = 0;
            for(var _node in result){
                if(result[_node].id.split("-").pop() == _SableState.ProductId.split("-").pop() && result[_node].brand != "Base"){
                    MultipleSKU += 1;
                }
            }
            var UpdateOldBase = false;
            for(var key in result){
                if(result[key].id == _SableState.ProductId && result[key].color == _SableState.ProductColor){
                    this.PControl.update("id", postMessage.id.replaceAll(" ", ""), result[key].key);
                    this.PControl.update("sizes", CSizes, result[key].key);
                    if(postMessage.Active_Product == 'on'){
                        this.PControl.update("active", true, result[key].key);
                    }else{
                        this.PControl.update("active", false, result[key].key);
                    }                    
                    this.PControl.update("description", postMessage.Description, result[key].key);
                    if(MultipleSKU > 1){
                        this.PControl.create(postMessage.id.split("-").pop(), "Base", "Base", "Base", "Base", "Base");
                        this.#DeleteProduct(req, res, {_Delete:`${_SableState.ProductId} ${postMessage.Brand} ${_SableState.ProductColor}`}, _SableState, SableMenu);
                    }else{
                        UpdateOldBase = true;
                    }
                    break;
                }
            }
            if(UpdateOldBase){
                for(var key in result){
                    if(_SableState.ProductId.split("-").pop() == result[key].id && result[key].brand == "Base"){
                        this.PControl.update("id", postMessage.id.split("-").pop(), result[key].key);
                        break;
                    }
                }
            }
        })
    }



    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {SablePageState} _SableState 
     * @param {SableMenu} SableMenu 
     * @returns 
     */
    HandleSablePost(req, res, _SableState, SableMenu){
       _SableState.Reset();
        let postMessage = req.body;
        
        
        if(postMessage.saveForm == "Update"){
            this.#UpdateProduct(req, res, _SableState, postMessage, SableMenu);
        }
        
        if(postMessage.id != undefined && postMessage.Brand != undefined && postMessage.I_Product == undefined){
            this.#AddProduct(req, res, postMessage);
        }
        if(postMessage._Delete != undefined){
            this.#DeleteProduct(req, res, postMessage, _SableState, SableMenu); //Go to Delete function
            
            postMessage._Delete = undefined;
        }
        if(postMessage.CancelButton != undefined && postMessage.CancelButton != ''){
            _SableState.HandleMenuPost(_SableState.IndexTable.Cancel, postMessage.CancelButton, SableMenu);
            this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu); //Render the page
        }
        if(postMessage._Search != undefined){
            if(postMessage._Search == ''){
                _SableState.Reset();
                _SableState.SectionId = "Base SKU";
                this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu);
                return;
            }            
            _SableState.HandleMenuPost(_SableState.IndexTable.Search, postMessage._Search, SableMenu);
            this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu); //Render the page
        }
       if(postMessage.I_Product != undefined && postMessage.I_Product != ''){ // If the query is a product query then add this data
        _SableState.HandleMenuPost(_SableState.IndexTable.AllDispay, postMessage.I_Product, SableMenu);
        this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu); //Render the page
        }
        if(postMessage.E_Product != undefined && postMessage.E_Product != ''){ // If the query is a product query then add this data
            _SableState.HandleMenuPost(_SableState.IndexTable.BrandDisplay, postMessage.E_Product, SableMenu);
            this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu); //Render the page
        }
        if(postMessage._Add != undefined && postMessage._Add != ''){
            _SableState.HandleMenuPost(_SableState.IndexTable.Add, postMessage._Add, SableMenu);
            this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu); //Render the page
        }
        if(postMessage.C_Product != undefined && postMessage.C_Product != ''){
            _SableState.HandleMenuPost(_SableState.IndexTable.ColorDisplay, postMessage.C_Product, SableMenu);
            this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu); //Render the page
        }
    }
}

module.exports = ResponseHandler