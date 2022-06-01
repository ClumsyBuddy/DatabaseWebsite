const Log = require("./Logger");
const MasterLogger = require("./MasterLogger");
const SableMenu = require("./Sable/SableMenuFunction");
const SablePageState = require("./Sable/SableState");


class  ResponseHandler{
    /**
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
                res.render(Data.PageToRender, {Data});
            })
    }

    #AddProduct(req, res, postMessage){
        this.ProductLog.New(`Attempting to Add: [${postMessage.id} | ${postMessage.Brand} | ${postMessage.Color}]`);
        console.log(postMessage.Description);
        var CSizes = "";
        for(var Sizes in postMessage.CheckBox){
            if(Sizes == postMessage.CheckBox.length - 1){
                CSizes += postMessage.CheckBox[Sizes];
            }else{
                CSizes += postMessage.CheckBox[Sizes] + ",";
            }
        }
        this.PControl.getAll().then((result) => {
            var _id = postMessage.id;
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

    #DeleteProduct(req, res, postMessage){
        console.log(postMessage)
        let Formatted = postMessage._Delete.split(" "); //Split Query by the spaces
        this.ProductLog.New(`Deleting: [${postMessage._Delete}]`);
        this.PControl.delete(Formatted[0], Formatted[1], Formatted[2]).then((Resolve) => { //Delete specified product based on sku, brand and color
            this.ProductLog.New("Deleted: " + JSON.stringify(Resolve));
        }, (Reject) => {
            this.ProductLog.New("Could not Delete: " + JSON.stringify(Reject));
        }).bind(this);
        this.PControl.getAll().then((result)=>{//Check if the only remaining product with specified SKU is the base and if so delete it
            var Items = [];
            for(var _node in result){
                if(result[_node].id.includes(Formatted[0].split("-").pop())){
                    Items.push(result[_node]);
                }
            }
            if(Items.length == 1){
                if(Items[0].brand == "Base"){
                    this.ProductLog.New("No remaining Products with SKU, Deleting Base");
                    this.PControl.delete(Items[0].id, "Base", "Base");
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
        if(postMessage.id != undefined && postMessage.Brand != undefined && postMessage.I_Product == undefined){
            this.#AddProduct(req, res, postMessage);
        }
        if(postMessage._Delete != undefined){
            this.#DeleteProduct(req, res, postMessage); //Go to Delete function
            _SableState.HandleMenuPost(_SableState.IndexTable._ReRender, postMessage, SableMenu);
            this.RenderAll(req, res, _SableState.ReturnClassObject(), SableMenu);
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