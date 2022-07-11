function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

function RemoveChildNodes(Element){ //Removes All Childeren and returns true if it manages to remove all else return false
    var count = 0;
    while(Element.hasChildNodes()){ //Remove all childeren from the BaseContainer
        Element.removeChild(Element.firstChild);
        if(count > 100000){
            console.log("RemoveChildNodes Reached Max on node: \n" + Element);
            return false;
        }
        count++;
    }
    return true;
}


function setAttributes(el, attrs) {
    if(el == undefined){
        return;
    }
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

export {setAttributes, RemoveChildNodes, isScrolledIntoView};