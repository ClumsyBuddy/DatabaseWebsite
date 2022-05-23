
class  ResponseHandler{
    constructor(MainIndex, PControl){
        this.FrontPage = MainIndex;
        this.PControl = PControl;
        }

    RenderAll(req, res){
        this.PControl.getAll().then((result) => {
            var ItemArray = [];
            ItemArray = result;
            res.render('pages/Sable', {
                DisplayTitle: "Welcome To Sable",
                displayProducts: ItemArray,
                _Action: '/Sable',
                DisplayPopUp: false,
                DisplayOnly: false,
                DisplayOnlyEdit: false,
                DisplayProductSection: false
            });
        })
    }
    
    FindById(req, res, query){
        this.PControl.getAll().then((result) =>{
            var ItemArray = [];
            for(var _node in result){
                if(result[_node].id.includes(query)){
                    ItemArray.push(result[_node]);
                }
            }
            res.render('pages/Sable', {
                DisplayTitle: "Welcome To Sable",
                displayProducts: ItemArray,
                _Action: '/Sable',
                DisplayPopUp: false,
                DisplayOnly: false,
                DisplayOnlyEdit: false,
                DisplayProductSection: false
            });
        })  
    }

    RenderById(req, res, query, DisplayPopUp = false, _DisplayProductSection = false, _DisplayOnly = false, _DisplayOnlyEdit = false){
        this.PControl.getById(query).then((result) =>{
            if(result == undefined){
                this.RenderAll(req, res);
                return;
            }
            var ItemArray = [];
            if(Array.isArray(result) == false){
                ItemArray.push(result);
            }else{
                ItemArray = result;
            }
            
            console.log(ItemArray);

            res.render('pages/Sable', {
                DisplayTitle: "Welcome To Sable",
                displayProducts: ItemArray,
                _Action: '/Sable',
                DisplayPopUp: DisplayPopUp,
                DisplayOnly: _DisplayOnly,
                DisplayOnlyEdit: _DisplayOnlyEdit,
                DisplayProductSection: _DisplayProductSection
            });
        })
    }



    AddProduct(req, res, postMessage){
        
        var Message = `Adding: [${postMessage.id}]`
        console.log(Message);
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
            console.log(_id);
            console.log("ID: " + _id)
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
                    if(result[key].id == Data.Brand_Id){
                        Data.Duplicate_Id = true;
                        if(result[key].Color == postMessage.Color){
                            Data.Duplicate_Color = true;
                        }
                    }  
                }
            }

            if(Data.Base == false){
                this.PControl.create(_id, "Base", "Base", "Base");
            }

            if(Data.Duplicate_Id == false){
                this.PControl.create(Data.Brand_Id, postMessage.Brand, postMessage.Color, CSizes);
            }

            if(Data.Duplicate_Id == true && Data.Duplicate_Color == false){
                this.PControl.create(Data.Brand_Id, postMessage.Brand, postMessage.Color, CSizes);
            }

        });
        
    }



    HandleSablePost(req, res){
        let postMessage = req.body;

        if(postMessage.id != undefined & postMessage.Brand != undefined && postMessage.I_Product == undefined){
            this.AddProduct(req, res, postMessage);
        }
       
        if(postMessage._Delete != undefined){
            var Message = `Deleting: [${postMessage._Delete}]`
            console.log(Message);
            this.PControl.delete(postMessage._Delete);
            res.redirect(req.get("referer"));
            postMessage._Delete = undefined;
        }
    }

}


module.exports = ResponseHandler