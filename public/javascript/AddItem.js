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
        this.FinalSelected = [];
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
        RemoveChildNodes(this.Overlay_Content);
        RemoveChildNodes(this.SKU_Brand_Section);
        RemoveChildNodes(this.Options_Section);
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
    }

    AddBrands(){
        this.SKU_Brand_Section.appendChild(this.EleBuilder.TextBox({
            col:20, row:1, defaultText:"Enter SKU"
        }, {Data:{DataName:"data-sku", DataValue:""}}));

        this.SKU_Brand_Section.appendChild(this.EleBuilder.DropDownMenu({
            Values:this.Brands
        }, {CallBack:this.AddOptions.bind(this)}));
        this.AddOptions(this.Brands[0]);
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
        console.log("NewOption: " + NewOptions);
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
                                console.log(_option);
                                this.BuildRow(ColumnId, ColumnIndex, RowId, RowIndex, this.BrandContainer[n], _option);
                                RowIndex++;
                            }else{
                                this.BuildRow(ColumnId, ColumnIndex, RowId, RowIndex, this.BrandContainer[n], _option);
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
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.Input({type:"checkbox", value:_option.Values[i].ValueName, checked:_option.Values[i].Value, name:_option.OptionName}, {CallbacK:this.HandleCheckBox.bind(this), CBParam:[_option, BrandContainer, _option.Values[i]]}));
            }
            if(_option.GetUIType() == "TextBox"){
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.TextBox({col:20, row:2, MaxLength:30}, {Callback:this.Test.bind(this), CBParam:[_option, BrandContainer]}));
            }
            if(_option.GetUIType() == "Radial"){
                var f = 'Field';
                var Check_True = _option.Values[i].Value === "true" ? true : false;
                var Check_False = _option.Values[i].Value === "false" ? true : false;
                document.getElementById(RowId+RowIndex+Inner).appendChild(this.EleBuilder.FieldSet({_id:RowId+RowIndex+Inner+f}));
                document.getElementById(RowId+RowIndex+Inner+f).appendChild(this.EleBuilder.Label({TextContent:"True", colorChange:{A:true, Color:"white"}}));
                document.getElementById(RowId+RowIndex+Inner+f).appendChild(this.EleBuilder.Input({type:"radio", value:"true", name:_option.OptionName, checked:Check_True}, {CallbacK:this.HandleRadioButton.bind(this), CBParam:[_option, BrandContainer], Event:'change'}));
                document.getElementById(RowId+RowIndex+Inner+f).appendChild(this.EleBuilder.Label({TextContent:"False", colorChange:{A:true, Color:"white"}}));
                document.getElementById(RowId+RowIndex+Inner+f).appendChild(this.EleBuilder.Input({type:"radio", value:"false", name:_option.OptionName, checked:Check_False }, {CallbacK:this.HandleRadioButton.bind(this), CBParam:[_option, BrandContainer], Event:'change'}));
            }
        }
    }

    HandleRadioButton(Params){
        var _option = Params.Params[0];
        var _brand = Params.Params[1];
        var Event = Params.e;
        console.log(_brand);
        if(Event.target.checked && Event.target.value === "true"){
            _option.Values[0].Value = "true";
        }else if(Event.target.checked && Event.target.value === "false"){
            _option.Values[0].Value = "false";
        }
    }
    //TODO Should probably be more thoughtful about whether I send Value or Option
    HandleCheckBox(Params){
        var _option = Params.Params[0];
        var _brand = Params.Params[1];
        var Value = Params.Params[2];
        var Event = Params.e;
        console.log(Event.target.checked);
        if(Event.target.checked === true){
            Value.Value = true;
        }else{
            Value.Value = false;
        }
        console.log("CheckBox");
        //_option.Values[0].UpdateValue(Event.target.value);
    }



    Test(Params){
        console.log("Test");
        console.log(Params.Params[0], Params.Params[1]);
        Params.Params[0].Values[0].UpdateValue(Params.e.target.value);
        console.log(Params.Params[0].Selected);
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
        _class = ""  } = {}, {Callback = undefined, CBParam = [], Event="input",
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
        t.addEventListener(Event, (e) => {
            var Params = CBParam;
            Callback({Params, e});
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
        if(_class != ""){
            MainSelect.setAttribute("class", _class);
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
        var Text = JSON.stringify(TextContent);
        var newText = Text.replace(/_/g, " ");
        l.textContent = newText.replace(/"/g, "");
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
    Input({_class="", _id="", type="", value="", name="", checked=false} = {}, {CallbacK = undefined, CBParam = [], Event="click"} = {}){
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
        i.checked = checked;

        if(CallbacK == undefined){
            return i;
        }
        i.addEventListener(Event, (e) => {
            var Params = CBParam;
            CallbacK({Params, e});
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
        this.Selected = false;
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
        //if(this.Values[0].ValueName === ""){
        //    return "TextBox";
        //}
        return "CheckBox";
    }
}

class Value{
    /**
     * 
     * @param {string} Name 
     * @param {Option} _Parent 
     */
    constructor(Name, _Parent){
        this.ValueName = Name;
        this.Value = undefined;
        this.Selected = false;
        this.Parent = _Parent;
    }
    UpdateValue(val){
        this.Value = val;
        this.Selected = true;
        this.Parent.IsThisOptionSelected();
    }

}
