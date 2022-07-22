export class ElementBuilder{
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
        _class = "", TextContent="" } = {}, {CallBack = undefined, CBParam = [], Event = "click"} = {})
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
            s.textContent = TextContent;
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
        _class = "",
        _id = ""  } = {}, {Callback = undefined, CBParam = [], Event="input",
                                Data={A:false, DataName:"", DataValue:""}} = {})
        {
        var t = document.createElement("textarea");
        var Style = [];
        t.cols = col;
        t.rows = row;
        t.setAttribute('maxlength', MaxLength);
        t.setAttribute("placeholder", defaultText);
        t.setAttribute("class", _class);
        t.id = _id;
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
                //s.setAttribute("href", href);
                s.href = href;
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
                    //s.setAttribute("style", "background-color:" + colorChange.Color);
                    s.style["background-color"] = colorChange.Color;
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
    Input({_class="", _id="", type="", value="", name="", checked=false, ActLikeRadio = false} = {}, {CallbacK = undefined, CBParam = [], Event="click"} = {}){
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
            if(ActLikeRadio){
                var checkboxes = document.getElementsByName(name);
                checkboxes.forEach((item) => {
                    if (item !== i) item.checked = false
                });
            }
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