class Brand{
    constructor(Name){
        this.BrandName = Name;
        this.Selected = false;
        this.Type;
    }
    AddItemType(ItemTypeObject){
        this.Type = ItemTypeObject;
    }
    IsThisOptionSelected(){
        var NewSelected = false;
        for(let i = 0; i < this.Type.Options.length; i++){
            if(this.Type.Options[i].IsThisOptionSelected() == true){
                NewSelected = true;
                console.log("Option Selected");
            }
        }
        if(NewSelected){
            this.Selected = true;
            return this.Selected;
        }
        this.Selected = false;
        return this.Selected;
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
    IsSelected(){
        if(this.Value === true || this.Value === false){
            this.Selected = this.Value;
        }
        return this.Selected;
    }
    RadioBoolFlip(){
        for(let index in this.Parent.Values){
            if(this.Parent.Values[index] == this){
                continue;
            }
            this.Parent.Values[index].Selected = false;
            this.Parent.Values[index].Value = false;
        }
    }
}



export {Brand, ItemType, Option, Value};