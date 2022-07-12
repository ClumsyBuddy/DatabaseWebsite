import {setAttributes, RemoveChildNodes} from "./Utility.js";


/*
* This Function Setups the First Element in the ProductList to be Copied and changed for the rest of them
*/
export function CreateProductContainer(){
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


/*
*   This function adds the Attributes and Text to the Empty Elements Created From CreateProductContainer
*/
export function Produce(Ele, key, sku, brand, color){
    Ele.setAttribute("style", `background-image: url()`);
    Ele.children[0].setAttribute("value", `${key}`);
    Ele.children[0].children[0].setAttribute("value", `${key}`);
    Ele.children[1].children[0].setAttribute("value", `${key}`);
    Ele.children[2].children[0].setAttribute("value", `${key}`);
    Ele.children[2].children[0].children[0].children[0].textContent = `SKU:${sku}`;
    Ele.children[2].children[0].children[0].children[1].textContent = `Brand:${brand}`;
    Ele.children[2].children[0].children[0].children[2].textContent = `Color:${color}`;
    return true;
}



export function CloseNav(){
    document.getElementById("FullNav").style.width = "0%";
    setTimeout(() => {
        if(document.getElementById("BButton")){
            document.getElementById("BButton").remove();
        }
        //RemoveChildNodes(document.getElementById("OVC"));        
    }, 10);
}

export function BackButton(){ //Possibly need something like a state to keep track
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


