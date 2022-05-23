const fs = require('fs');
const path = require('path');

class  ResponseHandler{
    constructor(MainIndex, PControl){
        this.FrontPage = MainIndex;
        this.PControl = PControl;
        this.Arguements = {
            DisplayTitle: "",
            displayProducts: undefined,
            _Action: "",
            DisplayPopUp: false
        }
        }

    RenderAll(req, res){
        this.PControl.getAll().then((result) => {
            var ItemArray = [];
            ItemArray = result;
            res.render('pages/Sable', {
                DisplayTitle: "Welcome To Sable",
                displayProducts: ItemArray,
                _Action: '/Sable',
                DisplayPopUp: false
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
                DisplayPopUp: false
            });
        })  
    }

    RenderById(req, res, query, DisplayPopUp = false){
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
            res.render('pages/Sable', {
                DisplayTitle: "Welcome To Sable",
                displayProducts: ItemArray,
                _Action: '/Sable',
                DisplayPopUp: DisplayPopUp
            });
        })
    }

    HandleSablePost(req, res){
        var postMessage = req.body;
        if(postMessage._ID != undefined & postMessage._NAME != undefined){
            var Message = `Adding: [${postMessage._ID}]`
            console.log(Message);
            this.PControl.create(postMessage._ID, postMessage._NAME);
            res.redirect(req.get("referer"));
            postMessage._ID = undefined;
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