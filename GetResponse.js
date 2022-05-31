const Log = require("./Logger");
const MasterLogger = require("./MasterLogger");


class  ResponseHandler{
    /**
     * @param {MasterLogger} _Logger
     */
    constructor(MainIndex, PControl, _Logger){
        this.FrontPage = MainIndex;
        this.PControl = PControl;
        this.MLogger = _Logger
        this.ProductLog = new Log(this.MLogger, "PHandle");
        }

    RenderAll(req, res, Data, callback){
            this.PControl.getAll().then((result) => {
                var ItemArray = [];
                //If the result array is empty push result into the array otherwise make itemarray equal to result
                if(Array.isArray(result) == false){  
                    ItemArray.push(result);
                }else{
                    ItemArray = result;
                }
                
                if(callback != undefined && Data.DisplayProductList){
                    ItemArray = callback.ReturnItemList(Data.FindProducts, ItemArray, Data.Query, Data.Color);
                }
                console.log(ItemArray);

                Data.ProductList = ItemArray;
                res.render(Data.PageToRender, {Data});
            })
    }

    AddProduct(req, res, postMessage){
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
            var _id = postMessage.id;
            if(result.length == 0){
                this.PControl.create(_id, "Base", "Base", "Base");
                this.PControl.create(`${postMessage.Brand}-${_id}`, postMessage.Brand, postMessage.Color, CSizes);
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
                this.PControl.create(_id, "Base", "Base", "Base");
                this.ProductLog.New(`Successfully added base: [${postMessage.id}]`);
            }
            if(Data.Duplicate_Id == false){
                this.PControl.create(Data.Brand_Id, postMessage.Brand, postMessage.Color, CSizes);
                this.ProductLog.New(`Successfully added: [${Data.Brand_Id} | ${postMessage.Brand} | ${postMessage.Color}]`);
            }
            if(Data.Duplicate_Id == true && Data.Duplicate_Color == false){
                this.PControl.create(Data.Brand_Id, postMessage.Brand, postMessage.Color, CSizes);
                this.ProductLog.New(`Successfully added Color: [${Data.Brand_Id} | ${postMessage.Brand} | ${postMessage.Color}]`);
            }
        });
    }

    HandleSablePost(req, res){
        let postMessage = req.body;
        if(postMessage.id != undefined && postMessage.Brand != undefined && postMessage.I_Product == undefined){
            this.AddProduct(req, res, postMessage);
        }
        if(postMessage._Delete != undefined){
            let Formatted = postMessage._Delete.split(" ");
            var Message = `Deleting: [${postMessage._Delete}]`
            this.ProductLog.New(Message);
            this.PControl.delete(Formatted[0], Formatted[1], Formatted[2]).then((Resolve) => {
                this.ProductLog.New("Deleted: " + JSON.stringify(Resolve));
            }, (Reject) => {
                this.ProductLog.New("Could not Delete: " + JSON.stringify(Reject));
            }).bind(this);
            res.redirect(req.get("referer"));
            postMessage._Delete = undefined;
        }
    }
}

module.exports = ResponseHandler