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
        this.BrandContainer = []; //Container for all of the itemdata
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
        RemoveChildNodes(this.SKU_Brand_Section);
        RemoveChildNodes(this.Options_Section);
        this.ParseItemData();
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
            TextContent:Items[i].ItemType, Data:{"DataName":"data-ItemType", "DataValue":Items[i].ItemType}}, 
            {Callback:function(){
                console.log("Clicked: " + Items[i].ItemType);
                if(this.AddProductObj.CurrentState == this.AddProductObj.States.ItemType){
                    this.AddProductObj.ItemType = Items[i].ItemType;
                    this.AddProductObj.CurrentState += 1;
                    console.log("Itemtype: " + this.AddProductObj.ItemType);
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
    }

    AddBrands(){
        this.SKU_Brand_Section.appendChild(this.EleBuilder.TextBox({
            col:20, row:1, defaultText:"Enter SKU"
        }, {Data:{DataName:"data-sku", DataValue:""}}));

        this.SKU_Brand_Section.appendChild(this.EleBuilder.DropDownMenu({
            Values:this.Brands
        }, {CallBack:this.AddOptions.bind(this)}));
    }
    /**
     * 
     * @param {string} SelectedBrand 
     */
    AddOptions(SelectedBrand){
        RemoveChildNodes(this.Options_Section);
        this.BrandContainer = [];
        console.log(SelectedBrand);
        for(let n = 0; n < this.Brands.length; n++){
            this.BrandContainer.push(new Brand(this.Brands[n]));
            this.BrandContainer[n].AddItemType(new ItemType(this.AddProductObj.ItemType, this.BrandContainer[n]));
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
                    
                    for(let j = 0; j < this.ItemDataContainer[i].ItemOptions.length; j++){
                        let _option = new Option(this.ItemDataContainer[i].ItemOptions[j], this.BrandContainer[n].Type);
                        this.BrandContainer[n].Type.Options.push(_option);
                        //Can Problably Add A div with a label here
                        if(this.BrandContainer[n].BrandName == SelectedBrand.replace("_", "")){
                            //this.BrandContainer[n].Type.Options[j].AddButton(this.Options_Section, this.EleBuilder);

                            for(let k = 0; k < this.ItemDataContainer[i].ItemOptionsValues[j][this.ItemDataContainer[i].ItemOptions[j]].length; k++){
                                //Add Each Value to the Option Div here
                                let _value = new Value(this.ItemDataContainer[i].ItemOptionsValues[j][this.ItemDataContainer[i].ItemOptions[j]][k], _option);
                                this.BrandContainer[n].Type.Options[j].Values.push(_value);
                            }  

                            if(ColumnIndex == 1 && RowIndex == 1){
                                this.BuildColumn(SheetContainer, ColumnId, ColumnIndex);
                                this.BuildRow(ColumnId, ColumnIndex, RowId, RowIndex, _option);
                                RowIndex++;
                            }else{
                                this.BuildRow(ColumnId, ColumnIndex, RowId, RowIndex, _option);
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
    BuildRow(ColumnId, ColumnIndex, RowId, RowIndex, _option){
        var Inner = "InnerRow";
        document.getElementById(ColumnId+ColumnIndex).appendChild(this.EleBuilder.Div({_id:RowId+RowIndex, _class:"Row"}));
        document.getElementById(RowId+RowIndex).appendChild(this.EleBuilder.Div({_id:RowId+RowIndex+Inner, _class:"InnerRow"}));
        document.getElementById(RowId+RowIndex).prepend(this.EleBuilder.Label({TextContent:_option.OptionName, colorChange:{A:true, Color:"white"}}));
        for(let i = 0; i < _option.Values.length; i++){
            if(_option.GetUIType() == "CheckBox"){
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Label({TextContent:_option.Values[i].ValueName, colorChange:{A:true, Color:"white"}}));
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Input({type:"checkbox", value:_option.Values[i].ValueName, name:_option.OptionName}));
            }
            if(_option.GetUIType() == "TextBox"){
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.TextBox({col:20, row:2, MaxLength:30}));
            }
            if(_option.GetUIType() == "Radial"){
                var f = 'Field';
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.FieldSet({_id:RowId+RowIndex+Inner+f}));

                document.getElementById(RowId+RowIndex+Inner+f).appendChild(this.EleBuilder.Label({TextContent:"True", colorChange:{A:true, Color:"white"}}));
                document.getElementById(RowId+RowIndex+Inner+f).appendChild(this.EleBuilder.Input({type:"radio", value:true, name:_option.OptionName}));
                document.getElementById(RowId+RowIndex+Inner+f).appendChild(this.EleBuilder.Label({TextContent:"False", colorChange:{A:true, Color:"white"}}));
                document.getElementById(RowId+RowIndex+Inner+f).appendChild(this.EleBuilder.Input({type:"radio", value:false, name:_option.OptionName}));
            }
        }

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
        _class = "" } = {}, {CallBack = undefined, CBParam = [], Event = "click"} = {})
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
        
            if(CallBack == undefined){
                return s;        
            }
            s.addEventListener(Event, () => {
                CallBack(CBParam);
            });
            return s;        
        }

    TextBox(
        {VerticalResize = false,
        Horizontalresize = false,
        ResizeAble = false, 
        col = 10, row =  10, MaxLength = 20,
        defaultText = "",
        _class = ""  } = {}, {Callback = undefined, CBParam = [], Event="selectionchange",
                                Data={A:false, DataName:"", DataValue:""}} = {})
        {
        var t = document.createElement("textarea");
        var Style = [];
        t.setAttribute("cols", col);
        t.setAttribute("rows", row);
        t.setAttribute('maxlength', MaxLength);
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
        t.setAttribute("style", this.StyleStringBuilder(Style));
        if(Data.A == true){
            t.setAttribute(Data.DataName, Data.DataValue);
        }
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
        _class = "", Size=0} = {}, {CallBack = undefined, CBParam = [], Event="change",
                            Data={A:false, DataName:"", DataValue:""}}){

        var MainSelect = document.createElement("select");
        for(let i = 0; i < Values.length; i++){
            var NewEle = document.createElement("option");
            NewEle.value = "_"+Values[i];
            NewEle.textContent = Values[i];
            MainSelect.appendChild(NewEle);
        }
        if(Size > 0){
            MainSelect.setAttribute("Size", Size);
        }

        if(CallBack == undefined){
            return MainSelect;
        }
        MainSelect.addEventListener(Event, () => {
            CallBack(MainSelect.value, CBParam);
        });
        return MainSelect;
    }
    Div({_class="", width=undefined, height=undefined, _id="", 
        Data = {A:false, DataName:"", DataValue:""}}={}){
            var d = document.createElement("div");

            if(_class != ""){
                d.setAttribute("class", _class);
            }
            if(Data.A){
                d.setAttribute(DataName, DataValue);
            }
            if(_id != ""){
                d.setAttribute("id", _id);
            }
            if(width != undefined && height == undefined){
                d.setAttribute("style", "width:"+width+";");
            }
            if(height != undefined && width == undefined){
                d.setAttribute("style", "height:"+height+";");
            }
            if(width != undefined && height != undefined){
                setAttributes(d, {"style":"width:"+width+";"+"height:"+height+";"});
            }
        return d;
    }
    Label({_class = "", TextContent="", _id = "", colorChange={A:false, Color:""}} = {}){
        var  l = document.createElement("label");
        l.textContent = TextContent;
        if(_class != ""){
            l.setAttribute("class", _class);
        }
        if(_id != ""){
            l.setAttribute("id", _id);
        }
        if(colorChange.A){
            l.setAttribute("style", "color:"+colorChange.Color+";");
        }
        return l;
    }
    Input({_class="", _id="", type="", value="", name=""} = {}, {CallbacK = undefined, CBParam = [], Event="click"} = {}){
        var  i = document.createElement("input");
        if(_class != ""){
            i.setAttribute("class", _class);
        }
        if(_id != ""){
            i.setAttribute("id", _id);
        }
        if(type != ""){
            i.setAttribute("type", type);
        }
        if(value != ""){
            i.setAttribute("value", value);
        }
        if(name != ""){
            i.setAttribute("name", name);
        }


        if(CallbacK == undefined){
            return i;
        }
        i.addEventListener(Event, () => {
            CallbacK(CBParam);
        });

        return i;
    }
    FieldSet({_id=""} = {}){
        var f = document.createElement("fieldset");
        if(_id != ""){
            f.setAttribute("id", _id);
        }
        return f;
    }
}

class Brand{
    constructor(Name){
        this.BrandName = Name;
        this.Type;
    }
    AddItemType(ItemTypeObject){
        this.Type = ItemTypeObject;
    }
}

class ItemType{
    constructor(Name, _Parent){
        this.TypeName = Name;
        this.Options = [];
        this.Parent = _Parent;
    }
    AddOptions(ListOfOptionObjects){
        this.Options = ListOfOptionObjects;
    }
}

class Option{
    constructor(Name, _Parent){
        this.OptionName = Name;
        this.Values = [];
        this.Selected = false;
        this.Parent = _Parent;
    }
    AddValues(ListOfValuesObjects){
        this.Values = ListOfValuesObjects;
    }
    AddButton(ele, EleBuilder){
        ele.appendChild(EleBuilder.Button({TextContent:this.OptionName}));
    }
    IsThisOptionSelected(){
        var NewSelected = false;
        for(let i = 0; i < this.Values.length; i++){
            if(this.Values[i].Selected == true){
                NewSelected = true;
            }
        }
        if(NewSelected){
            this.Selected = true;
            return this.Selected;
        }
        this.Selected = false;
        return this.Selected;
    }
    
    GetUIType(){
        if(this.Values == []){
            return undefined;
        }
        if(typeof this.Values[0].ValueName == "boolean"){
            return "Radial";
        }
        if(this.Values[0].ValueName === ""){
            return "TextBox";
        }
        return "CheckBox";
    }
}

class Value{
    constructor(Name, _Parent){
        this.ValueName = Name;
        this.Selected = false;
        this.Parent = _Parent;
    }
}
