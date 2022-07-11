import "./Globals.js"
import { isScrolledIntoView, RemoveChildNodes } from "./Utility.js"
import { CreateElement } from "./HtmlBuilder.js";



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
export function BuildProductArray(msg, StartIndex, FinishIndex){
    for(let j = StartIndex; j < FinishIndex; j++) //Build the elements
    {
        Produce(ProductList[j], msg[j].key, msg[j].sku, msg[j].brand, msg[j].Color);
    }
    console.log("Finished: " + StartIndex + " - " + FinishIndex);
}


export function BuildFactory(msg, Length, Max){
    try{
        for(let i = 0; i < Math.ceil(Length / Max); i++){
            setTimeout(() => {
                if(i >= Math.floor(Length / Max) && Length / Max % 1 < 1){
                    BuildProductArray(msg, (Max*i), Length);
                }else{
                    BuildProductArray(msg, (Max*i), Max*(i+1));
                }
            }, 5*i);
        }
    }catch(e){
        console.log(e);
    }
}

export function FirstBuild(msg){
    if(msg.length > 0){
        var Node = CreateElement();
        for(let j = 0; j < msg.length; j++){
            ProductList.push(Node.cloneNode(true)); //Push Clones into the array to fill our product need
        }
    }
    BuildProductArray(msg, 0, ContainerLength);
    BuildFactory(msg, ProductList.length, ContainerLength);        

    RemoveChildNodes(BaseContainer);
    for(let items = 0; items < ContainerLength; items++){
        BaseContainer.appendChild(ProductList[items]);
    }
    AddButtonEventListeners();
    IndexTimingListener();
}


export function DeleteItem(ItemIndex){
    var PIndex = undefined;
    for(let i = 0; i < ProductList.length; i++){
        if(ProductList[i].children[0].children[0].getAttribute("value") == ItemIndex){
            PIndex = i;
            break;
        }
    }
    for(let k = 0; k < BaseContainer.children.length; k++){
        if(BaseContainer.children[k].isEqualNode(ProductList[PIndex])){
            BaseContainer.children[k].remove();

            if(ProductList[ClientData.DisplayIndex*ContainerLength+1] != undefined && PIndex+ContainerLength < ProductList.length && BaseContainer.children.length < ContainerLength){
                BaseContainer.appendChild(ProductList[ClientData.DisplayIndex*ContainerLength + 1]);
            }
            if(ProductList[ClientData.DisplayIndex*ContainerLength+1] != undefined && PIndex+ContainerLength < ProductList.length && BaseContainer.children.length > 100){
                BaseContainer.appendChild(ProductList[NextIndex*ContainerLength + 1]);
            }

            /*
            * //FIXME Missing one index when going back up
            *           One Extra index when going back down
            */

            if(PIndex + ContainerLength > ProductList.length){
                console.log("Length: " + ProductList.length);
                console.log((ProductList.length / ContainerLength));
                var Offset = Math.round(((ProductList.length / ContainerLength) % 1) * ContainerLength);
                console.log(Offset);
                BaseContainer.prepend(ProductList[(PreviousIndex-1)*ContainerLength - Offset]);
            }
            break;
        }
    }
    ProductList.splice(PIndex, 1);
}

export function UpdateList(){
    for(let i = 0; i < BaseContainer.children.length; i++){
        if(BaseContainer.children[i] == undefined){
            continue;
        }
        var CurrentNode = BaseContainer.childNodes[i];
        var Curr = ClientData.DisplayIndex; //CurrentIndex
        var Next = NextIndex; //NextIndex
        var Prev = PreviousIndex; //Previous Index
        
        var LastIndexValue = Math.ceil(ProductList.length-1 / ContainerLength); // <--- Potentially fixed with the -1 addition
        /*
        *   Check if element is what we are looking for, which is the last element in the index - Offset, then check if it is in the viewport
        */
        var UpOffset = (Curr * ContainerLength)-ViewOffset;
        if(Curr < LastIndexValue && CurrentNode.isEqualNode(ProductList[UpOffset]) && isScrolledIntoView(CurrentNode) && ScrollDirection.Down){
                /*
                *   Curr equal 1, so Next equals 2, which means we are adding 100 - 200
                */
                for(let u = (Curr * ContainerLength) + 1; u < (Next * ContainerLength) + 1; u++){
                    try{
                    if(ProductList[u] == undefined){
                        continue;
                    }
                    BaseContainer.appendChild(ProductList[u]);
                    if(Curr > 1){
                        BaseContainer.firstChild.remove();
                    }
                    }catch(e){
                        console.log(e);
                        console.log(u);
                    }
                }
                ClientData.DisplayIndex += 1;
        }
        var DownOffset = ((Prev-1) * ContainerLength) + ViewOffset;
        if(Curr > 1 && CurrentNode.isEqualNode(ProductList[DownOffset]) && isScrolledIntoView(CurrentNode) && ScrollDirection.Up){
            var Offset = 2;
            if(Curr == 2){
                Offset = 1;
            }
            var Decimal = (ProductList.length / ContainerLength) % 1;
            var Counter = 0;
            for(let d = ((Prev-1) * ContainerLength) - 1; d > ((Prev-Offset) * ContainerLength)-1; d--){
                try{                    
                BaseContainer.prepend(ProductList[d]);
                if(Curr == Math.ceil(ProductList.length / ContainerLength) && Decimal < 1){
                    if(Counter < (Decimal * 100)){
                        BaseContainer.lastChild.remove();
                    }
                    Counter++;
                }else{
                    BaseContainer.lastChild.remove();
                }
                }catch(e){
                    console.log(e);
                    console.log(d);
                }
            }
            ClientData.DisplayIndex -= 1;
        }
    }
}



function IndexTimingListener(){
    ClientData.registerListener(function(val){
        NextIndex = ClientData.DisplayIndex + 1;
        if(ClientData.DisplayIndex > 1){
            PreviousIndex = ClientData.DisplayIndex - 1;
        }
    });
}

export function AddButtonEventListeners(){
    BaseContainer.addEventListener("click", function(e){
        if(e.target){
            if(e.target.getAttribute("class") == "DeleteButton"){
                mySocket.emit('Delete', {Target:PageState, Value:e.target.getAttribute("value")});
            }
            if(e.target.getAttribute("class") == "UpdateButton"){
                console.log("Update");
            }
        }
    });
    Add.addEventListener('click', function(e) {
        console.log("Getting Item Data From Server");
        mySocket.emit('GetAdd', {Target:"Sable"}); //Get ItemData from server
    });
}

    



//var scrollLock = false;
export function AddScrollEvent(){
    BaseContainer.addEventListener("scroll", (e) => {
        if(PrevScrollPosition == 0){
            PrevScrollPosition = BaseContainer.scrollTop;
        }
        if(PrevScrollPosition > BaseContainer.scrollTop){
            ScrollDirection.Up = true;
            ScrollDirection.Down = false;
        }
        if(PrevScrollPosition < BaseContainer.scrollTop){
            ScrollDirection.Down = true;
            ScrollDirection.Up = false;
        }
        PrevScrollPosition = BaseContainer.scrollTop;
        if(!scrollLock){
            scrollLock = true;
            setTimeout(() => {
            UpdateList();
            scrollLock = false;      
            }, 5);
        }
    });
}

