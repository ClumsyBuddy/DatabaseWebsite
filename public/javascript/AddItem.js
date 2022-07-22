import { RemoveChildNodes, setAttributes } from "./Utility.js";
import {ElementBuilder} from "./ElementBuilder.js";
import {Brand, ItemType, Option, Value} from "./ItemInfo.js";

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
        this.BrandContainer = []; //Container for all of the itemdata
        this.FinalSelected = [];
        this.Overlay_Content = document.getElementById("OVC");
        this.Overlay_Title = document.getElementById("OVT");
        this.SKU_Brand_Section = document.getElementById("SKUBRAND");
        this.Options_Section = document.getElementById("Options");
        this.SKUError = document.getElementById("NeedSKU");
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
        RemoveChildNodes(this.Overlay_Content);
        RemoveChildNodes(this.SKU_Brand_Section);
        RemoveChildNodes(this.Options_Section);
        RemoveChildNodes(document.getElementById("SubmitButton"));
        this.SKUError.style.display = "none";
        this.BrandContainer = [];
        this.ParseItemData();
        this.StateHandler();
    }

    StateHandler(){
        switch (this.AddProductObj.CurrentState){
            case this.AddProductObj.States.ItemType:
                OVT.textContent = "Select ItemType";
                this.CreateSelection(this.Overlay_Content, this.AllData);
                break;
            case this.AddProductObj.States.DataEntry:

                break;
        }
    }
    CreateSelection(Ele, Items){
        for(let  i = 0; i < Items.length; i++){
            Ele.appendChild(this.EleBuilder.Button({Button_Tag:false, A_Tag:true, _class:"InfoItem", 
            TextContent:Items[i].ItemType.replace("_", " "), Data:{"DataName":"data-ItemType", "DataValue":Items[i].ItemType}}, 
            {Callback:function(){
                if(this.AddProductObj.CurrentState == this.AddProductObj.States.ItemType){
                    this.AddProductObj.ItemType = Items[i].ItemType;
                    this.AddProductObj.CurrentState += 1;
                    this.RemoveOtherItemType(this.AddProductObj.ItemType);
                    this.AddBrands();
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
        this.Overlay_Content.children[0].style["pointer-events"] = "none";
    }

    AddBrands(){
        this.SKU_Brand_Section.appendChild(this.EleBuilder.TextBox({
            col:20, row:1, defaultText:"Enter SKU", _id:"SKUTextBox"
        }, {Data:{DataName:"data-sku", DataValue:""}}));

        this.SKU_Brand_Section.appendChild(this.EleBuilder.DropDownMenu({
            Values:this.Brands
        }, {CallBack:this.AddOptions.bind(this)}));
        document.getElementById("SubmitButton").appendChild(this.EleBuilder.SubmitButton({Button_Tag:true, _class:"AddSubmitButton", TextContent:"Submit" }, {CallBack:this.SubmitButton.bind(this)}));
        this.AddOptions(this.Brands[0]);
    }

    SubmitButton(){
        console.log("Sumbit Button");
        if(document.getElementById("SKUTextBox").value == ""){
            this.SKUError.style.display = "";
            return;
        }
        console.log(this.BrandContainer);

        for(let index in this.BrandContainer){
            if(this.BrandContainer[index].Selected){
                console.log(this.BrandContainer[index]);
            }
        }
    }

    /**
     * 
     * @param {string} SelectedBrand 
     */
    AddOptions(SelectedBrand){
        RemoveChildNodes(this.Options_Section);
        //this.BrandContainer = [];
        var NewOptions;
        if(this.BrandContainer.length > 0){
            NewOptions = false;
            this.ParseItemData();
        }else{
            NewOptions = true;
        }
        //console.log("NewOption: " + NewOptions);
        if(NewOptions == true){
            for(let n = 0; n < this.Brands.length; n++){
                this.BrandContainer.push(new Brand(this.Brands[n]));
                this.BrandContainer[n].AddItemType(new ItemType(this.AddProductObj.ItemType, this.BrandContainer[n]));
            }
        }

        var ColumnIndex = 1;
        var ColumnId = "Column";
        var RowIndex = 1;
        var RowId = "Row";

        var SheetContainer = this.EleBuilder.Div({_id:"ColumnContainer", _class:"CContainer"});
        this.Options_Section.appendChild(SheetContainer);

        for(let i = 0; i < this.ItemDataContainer.length; i++){
            if(this.ItemDataContainer[i].ItemType == this.AddProductObj.ItemType){
                for(let n = 0; n < this.BrandContainer.length; n++){
                    var AlreadyHasOption = this.BrandContainer[n].Type.Options.length == 0 ? false : true;
                    if(this.BrandContainer[n].BrandName == SelectedBrand.replace("_", "")){
                        for(let j = 0; j < this.ItemDataContainer[i].ItemOptions.length; j++){
                            let _option = new Option(this.ItemDataContainer[i].ItemOptions[j], this.BrandContainer[n].Type);
                            if(!AlreadyHasOption){
                                this.BrandContainer[n].Type.Options.push(_option);
                            }
                            for(let k = 0; k < this.ItemDataContainer[i].ItemOptionsValues[j][this.ItemDataContainer[i].ItemOptions[j]].length; k++){
                                //Add Each Value to the Option Div here
                                //console.log(Object.keys(this.ItemDataContainer[i].ItemOptionsValues[j]));
                                let _value = new Value(this.ItemDataContainer[i].ItemOptionsValues[j][this.ItemDataContainer[i].ItemOptions[j]][k], _option);
                                if(!AlreadyHasOption){
                                    this.BrandContainer[n].Type.Options[j].Values.push(_value);
                                }else{
                                    _option.Values.push(this.BrandContainer[n].Type.Options[j].Values[k]);
                                }
                            }  
                            //console.log(RowIndex, ColumnIndex);
                            if(ColumnIndex == 1 && RowIndex == 1){
                                this.BuildColumn(SheetContainer, ColumnId, ColumnIndex);
                                //console.log(_option);
                                this.BuildRow(ColumnId, ColumnIndex, RowId, RowIndex, this.BrandContainer[n], this.BrandContainer[n].Type.Options[j]);
                                RowIndex++;
                            }else{
                                this.BuildRow(ColumnId, ColumnIndex, RowId, RowIndex, this.BrandContainer[n], this.BrandContainer[n].Type.Options[j]);
                                RowIndex++;
                                if(RowIndex % 3 == 1 && j < this.ItemDataContainer[i].ItemOptions.length-1){
                                    ColumnIndex++;
                                    this.BuildColumn(SheetContainer, ColumnId, ColumnIndex);
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log(this.BrandContainer);
    }

    BuildColumn(Ele, ColumnId, ColumnIndex){
        Ele.appendChild(this.EleBuilder.Div({_id:ColumnId+ColumnIndex, _class:"Column"}))
    }
    /**
     * 
     * @param {string} ColumnId 
     * @param {number} ColumnIndex 
     * @param {string} RowId 
     * @param {number} RowIndex 
     * @param {Option} _option 
     */
    BuildRow(ColumnId, ColumnIndex, RowId, RowIndex, BrandContainer, _option){
        //console.log("Adding");
        var Inner = "InnerRow";
        document.getElementById(ColumnId+ColumnIndex).appendChild(this.EleBuilder.Div({_id:RowId+RowIndex, _class:"Row"}));
        document.getElementById(RowId+RowIndex).appendChild(this.EleBuilder.Div({_id:RowId+RowIndex+Inner, _class:"InnerRow"}));
        document.getElementById(RowId+RowIndex).prepend(this.EleBuilder.Label({TextContent:_option.OptionName, colorChange:{A:true, Color:"white"}}));
        //console.log("Length: " + _option.Values.length);
        for(let i = 0; i < _option.Values.length; i++){
            if(_option.GetUIType() == "CheckBox"){
                var Name;
                if(_option.Values[i].ValueName === ""){
                    Name = "TextBox";
                }else{
                    Name = _option.Values[i].ValueName;
                }
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Label({TextContent:Name, colorChange:{A:true, Color:"white"}}));
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Input({type:"checkbox", value:_option.Values[i].ValueName, checked:_option.Values[i].Value, name:_option.OptionName}, {CallbacK:this.HandleCheckBox.bind(this), CBParam:[_option, BrandContainer, _option.Values[i]], Event:"change"}));
            }
            if(_option.GetUIType() == "TextBox"){
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.TextBox({col:20, row:2, MaxLength:30}, {Callback:this.Test.bind(this), CBParam:[_option, BrandContainer]}));
            }
            if(_option.GetUIType() == "Radial"){
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Label({TextContent:"True", colorChange:{A:true, Color:"white"}}));
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Input({type:"checkbox", value:"true", checked:_option.Values[i].Value, name:_option.OptionName, ActLikeRadio:true}, {CallbacK:this.HandleRadioButton.bind(this), CBParam:[_option, BrandContainer, _option.Values[i]], Event:"change"}));
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Label({TextContent:"False", colorChange:{A:true, Color:"white"}}));
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Input({type:"checkbox", value:"false", checked:_option.Values[i].Value, name:_option.OptionName, ActLikeRadio:true}, {CallbacK:this.HandleRadioButton.bind(this), CBParam:[_option, BrandContainer, _option.Values[i]], Event:"change"}));
            }
        }
    }

    HandleRadioButton(Params){
        var _option = Params.Params[0];
        var _brand = Params.Params[1];
        var Value = Params.Params[2];
        var Event = Params.e;
        console.log(Event.target);
        if(Event.target.checked === true){
            if(Event.target.value === "true"){
                Value.Value = true;
                Value.Selected = true;
            }else 
            if(Event.target.value === "false"){
                Value.Value = false;
                Value.Selected = true;
            }else{
                Value.Selected = false;
            }
        }else{
            Value.Value = false;
            Value.Selected = false;
        }
        //Value.IsSelected();
        _brand.IsThisOptionSelected();
        Value.RadioBoolFlip();
    }
    //TODO Should probably be more thoughtful about whether I send Value or Option
    HandleCheckBox(Params){
        var _brand = Params.Params[1];
        var Value = Params.Params[2];
        var Event = Params.e;
        console.log(Event.target.checked);
        if(Event.target.checked === true){
            Value.Value = true;
        }else{
            Value.Value = false;
        }
        Value.IsSelected();
        _brand.IsThisOptionSelected();
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
        //this.StateHandler();
    }
    


}




