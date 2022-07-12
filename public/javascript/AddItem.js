import { setAttributes } from "./Utility.js";
import { RemoveChildNodes } from "./Utility.js";

var ItemDataContainer = [];

class ItemData{
    constructor(){
        this.ItemType = "";
        this.ItemOptions = [];
        this.ItemOptionsValues = [];
        this.Selected = false;
    }
}

export function ParseItemData(_ItemData){
    ItemDataContainer = [];
    for(let i = 0; i < _ItemData.length; i++){
        ItemDataContainer.push(new ItemData);
        ItemDataContainer[i].ItemType = _ItemData[i].ItemType;
        for(let j = 0; j < _ItemData[i].Options.length; j++){
            ItemDataContainer[i].ItemOptions.push(Object.keys(_ItemData[i].Options[j])[0]);
            ItemDataContainer[i].ItemOptionsValues.push(_ItemData[i].Options[j]);
        }
    }
    console.log(ItemDataContainer);
}




export function GetSKU(Overlay_Content, OVT, msg){
    OVT.textContent = "Please Add SKU";
    CreateSelection(Overlay_Content, msg);
}

export function GetItemType(Overlay_Content, OVT, msg){
    OVT.textContent = "Select ItemType";
    CreateSelection(Overlay_Content, msg);
}

export function GetBrand(Overlay_Content, OVT, msg){
    OVT.textContent = "Select Brand";
    CreateSelection(Overlay_Content, msg);
}

export function GetItemOptions(Overlay_Content, OVT, msg){
    OVT.textContent = "Select Select Options";
    CreateSelection(Overlay_Content, msg);
}

export function GetOptionsValues(Overlay_Content, OVT, msg){
    OVT.textContent = "Select Values";
    CreateSelection(Overlay_Content, msg);
}

function CreateSelection(Ele, Items){
    for(let  i = 0; i < Items.length; i++){
        Ele.appendChild(MakeButton(Items[i].ItemType, i));
    }
    //Ele.parentNode.appendChild(TextBox({}));
    //Ele.parentNode.appendChild(SubmitButton({Button_Tag:true}));
}

function MakeButton(Content, Index, Callback){
    var ele = document.createElement("a");
    setAttributes(ele, {"class":"InfoItem",
                        "href": "javascript:void(0)",
                        "data-Selection": Index});
    ele.textContent = Content;
    ele.addEventListener("click", () =>{
            console.log("Clicked: " + ele.textContent);
            if(AddProductObj.CurrentState == AddProductObj.States.ItemType){
                AddProductObj.ItemType = ele.textContent;
                AddProductObj.CurrentState += 1;
                console.log("Itemtype: " + AddProductObj.ItemType);
                
            }
        });
        return ele;
}

function SubmitButton(
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

function TextBox(
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



function StyleStringBuilder(_style){
    var ReturnString = "";
    for(let i = 0; i < _style.length; i++){
        ReturnString += (_style[i]+"; ");
    }
    return ReturnString;
}