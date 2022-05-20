var _styles = {
    "PopContainer": {Open:"position:fixed; z-index: 10; width: 100%; height: 100%; background-color: rgba(0, 0, 0, .7); top: 0; left: 0;'", Close:"'display:none;"},
    "InnerPopUp": {Open: "", Close:"display:none;"}
}
function ClosePopUp(e){
    var Target = e.parentNode;
    if(Target.id == "InnerPopUp"){
        Target.parentNode.setAttribute("style", _styles.PopContainer.Close);
        Target.setAttribute("style", _styles.InnerPopUp.Close);
    }
    if(Target.id == "Login"){
        Target.setAttribute("style", "display:none;")
    }
}

if(document.getElementById("LoginButton") != undefined){
    document.getElementById("LoginButton").onclick = function(e){
        var GetElement = document.getElementById("Login");
    GetElement.setAttribute("style", "");
    }
}
function OpenPopUp(Product){    
    var GetElement = document.getElementById("InnerPopUp")
    GetElement.setAttribute("style", _styles.InnerPopUp.Open);
    GetElement.parentNode.setAttribute("style", _styles.PopContainer.Open);
    GetElement.setAttribute("data-product", Product);
    GetElement.parentNode.setAttribute("style", Product);
}