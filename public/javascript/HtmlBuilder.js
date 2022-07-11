import {setAttributes, RemoveChildNodes} from "./Utility.js";

function CreateElement(){
    var Container = document.createElement("div");
    setAttributes(Container, {'class':'ProductContainer', 'style':'background-image: url("");'});
    var Form1 = document.createElement("div");
    setAttributes(Form1, {"id":'Delete'});
    Form1.insertAdjacentHTML("beforeend", "<button class='DeleteButton' type='submit' name='Sable' value='null'></button>");
    var Form2 = document.createElement("div");
    setAttributes(Form2, {"id":'Update'});
    Form2.insertAdjacentHTML("beforeend", "<button class='UpdateButton' type='submit' name='Sable' value='null'></button>");
    var Form3 = document.createElement("div");
    setAttributes(Form3, {'style':'height:100%;'});
    Form3.insertAdjacentHTML("beforeend", '<button class="ProductButton" name="C_Product" value="null" ><div class="NameContainer"><p class="ItemName">SKU:null</p><p class="ItemName">Brand:null</p><p class="ItemName">Color:null</p></div></button>');    
    Container.appendChild(Form1);
    Container.appendChild(Form2);
    Container.appendChild(Form3);
    return Container;
}

function InfoBlock(msg){
    var ele = document.createElement("a");
    setAttributes(ele, {"class":"InfoItem",
                        "href": "javascript:void(0)",
                        "data-Selection": ""});
    ele.textContent = msg.ItemType;
    ele.addEventListener("click", () =>{
            console.log("Clicked: " + ele.textContent);
            SelectedItemType = ele.textContent;
            mySocket.emit("Get_Brand");
        });
    return ele;
}

function FNavCloseButtonListener(){
    document.getElementById('CloseButton').addEventListener('click', (e) =>{
        CloseNav();
    });
}


function CloseNav(){
    document.getElementById("FullNav").style.width = "0%";
    setTimeout(() => {
        if(document.getElementById("BButton")){
            document.getElementById("BButton").remove();
        }
        RemoveChildNodes(document.getElementById("OVC"));        
    }, 250);
}

function BackButton(){ //Possibly need something like a state to keep track
    var ele = document.createElement("a");
    setAttributes(ele, {"class":"BackButton",
                        "href": "javascript:void(0)",
                        "id": "BButton",
                        "style": "text-align:left"});
    ele.innerHTML = "&#8592;";
    ele.addEventListener("click", () => {
        console.log("Clicked: BackButton");
    });
    return ele;
}


export {CreateElement, InfoBlock, BackButton, FNavCloseButtonListener};