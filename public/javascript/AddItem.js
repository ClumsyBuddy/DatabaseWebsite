import { setAttributes, RemoveChildNodes } from "./Utility.js";



class ItemData{
    constructor(){
        this.ItemType =  "";
        this.ItemOptions = [];
        this.ItemOptionsValues = [];
    }
}


export class Add_Item{
    constructor(Items, Brand){
        this.SelectedItemType; //Stores the Itemtype we chose
        this.EnteredSKU;
        this.ItemDataContainer = []; //Container for all of the itemdata
        this.Overlay_Content = document.getElementById("OVC");
        this.Overlay_Title = document.getElementById("OVT");
        this.SKU_Brand_Section = document.getElementById("SKUBRAND");
        this.Options_Section = document.getElementById("Options");
        this.AllData = Items; //Data send from server
        this.Brands = Brand;
        this.Testvar = 1;
        this.AddProductObj = {
            States: {
                "ItemType":1,
                "DataEntry":2,
            },
            CurrentState: 1,
            ItemType:String = "",
            SKU:"",
            OptionData:[], 
            Reset: function(){
                
            },
        }
        this.EleBuilder = new ElementBuilder();
    }
    
    Init(){
        this.Testvar = 1010101;
        console.log(this.Brands);
        RemoveChildNodes(this.Overlay_Content);
        this.ParseItemData();
    }

    StateHandler(){
        switch (this.AddProductObj.CurrentState){
            case this.AddProductObj.States.ItemType:
                this.GetItemType(this.Overlay_Content, this.Overlay_Title, this.AllData);
                break;
            case this.AddProductObj.States.DataEntry:

                break;
        }
    }

    GetItemType(Overlay_Content, OVT, msg){
        OVT.textContent = "Select ItemType";
        this.CreateSelection(Overlay_Content, msg);
    }
    CreateSelection(Ele, Items){
        for(let  i = 0; i < Items.length; i++){
            Ele.appendChild(this.EleBuilder.Button({Button_Tag:false, A_Tag:true, _class:"InfoItem", 
            TextContent:Items[i].ItemType, Data:{"DataName":"data-ItemType", "DataValue":Items[i].ItemType}}, 
            {Callback:function(){
                console.log("Clicked: " + Items[i].ItemType);
                if(this.AddProductObj.CurrentState == this.AddProductObj.States.ItemType){
                    this.AddProductObj.ItemType = Items[i].ItemType;
                    this.AddProductObj.CurrentState += 1;
                    console.log("Itemtype: " + this.AddProductObj.ItemType);
                    this.RemoveOtherItemType(this.AddProductObj.ItemType);
                }
            }.bind(this), CBParam:[Items[i].ItemType, this.AddProductObj], colorChange:{A:true, Color:"#1E2E54"}} ) );
        }
    }
    RemoveOtherItemType(Chosen){
        for(let i = 0; i < this.Overlay_Content.children.length; i++){
            if(this.Overlay_Content.children[i].getAttribute("data-itemtype") === Chosen){
                continue;
            }else{
                this.Overlay_Content.children[i].remove();
            }
        }
        if(this.Overlay_Content.children.length > 1){
            this.RemoveOtherItemType(Chosen);
        }
    }

    AddBrands(){

    }


    ParseItemData(){
        this.ItemDataContainer = [];
        for(let i = 0; i < this.AllData.length; i++){
            this.ItemDataContainer.push(new ItemData);
            this.ItemDataContainer[i].ItemType = this.AllData[i].ItemType;
            for(let j = 0; j < this.AllData[i].Options.length; j++){
                this.ItemDataContainer[i].ItemOptions.push(Object.keys(this.AllData[i].Options[j])[0]);
                this.ItemDataContainer[i].ItemOptionsValues.push(this.AllData[i].Options[j]);
            }
        }
        console.log(this.ItemDataContainer);
        this.StateHandler();
    }
    


}

class ElementBuilder{
    constructor(){

    }
    StyleStringBuilder(_style){
        var ReturnString = "";
        for(let i = 0; i < _style.length; i++){
            ReturnString += (_style[i]+"; ");
        }
        return ReturnString;
    }


    SubmitButton(
        {Button_Tag = true,
        A_Tag = false,
        _class = "" } = {}, {Callback = undefined, CBParam = [], Event = "click"} = {})
        {
            var s;
            if(Button_Tag){
                s = document.createElement("button");
            }else
            if(A_Tag){
                s = document.createElement("a");
            }else
            if(Button_Tag && A_Tag | !Button_Tag, !A_Tag){
                throw console.error("No Button Option Selected: Function - SubmitButton | "+"ButtonTag: "+Button_Tag +" A_Tag: "+A_Tag);
            }
        
            s.setAttribute("class", _class);
        
            if(Callback == undefined){
                return s;        
            }
            s.addEventListener(Event, () => {
                Callback(CBParam);
            });
            return s;        
        }

    TextBox(
        {VerticalResize = false,
        Horizontalresize = false,
        ResizeAble = false, 
        col = 10, row =  10,
        defaultText = "",
        _class = ""  } = {}, {Callback = undefined, CBParam = [], Event=""} = {})
        {
        var t = document.createElement("textarea");
        var Style = [];
        t.setAttribute("col", col);
        t.setAttribute("row", row);
        t.setAttribute("placeholder", defaultText);
        t.setAttribute("class", _class);
        if(VerticalResize && !Horizontalresize){
            Style.push("resize:vertical");
        }else
        if(!VerticalResize && Horizontalresize){
            Style.push("resize:horizontal");
        }else
        if(!ResizeAble){
            Style.push("resize:none");
        }
        t.setAttribute("style", StyleStringBuilder(Style));
    
        if(Callback == undefined){
            return t;
        }
        s.addEventListener(Event, () => {
            Callback(CBParam);
        });
        return t;
    }
        
    Button(
        {Button_Tag = true,
        A_Tag = false,
        href = "javascript:void(0)",
        _class = "",
        Data = {DataName:false,DataValue:false},
        TextContent = "" } = {}, {Callback = undefined, CBParam = [], Event = "click", colorChange = {A:false, Color:""}} = {})
        {
            var s;
            if(Button_Tag){
                s = document.createElement("button");
            }else
            if(A_Tag){
                s = document.createElement("a");
                s.setAttribute("href", href);
            }else
            if(Button_Tag && A_Tag | !Button_Tag, !A_Tag){
                throw console.error("No Button Option Selected: Function - SubmitButton | "+"ButtonTag: "+Button_Tag +" A_Tag: "+A_Tag);
            }
            if(Data.DataName && Data.DataValue){
                s.setAttribute(Data.DataName, Data.DataValue);
            }
            s.setAttribute("class", _class);
            s.textContent = TextContent;
            if(Callback == undefined){
                return s;        
            }
            s.addEventListener(Event, () => {
                if(colorChange.A == true){
                    s.setAttribute("style", "background-color:" + colorChange.Color);
                }
                Callback(CBParam);
            });
            return s;        
        }

    DropDownMenu({Values = [], 
        _class = ""} = {}){

    }
        
}
