var BaseContainer = document.getElementById("ProductListContainer");

var Add = document.getElementById("Add");

var scrollLock = false;

var ScrollDirection = {Up:false, Down:false};

const ContainerLength = 100;

var ViewOffset = 5; //Element offset for visibility check

var ProductList = [];

var SelectedItemType = undefined;

var PrevScrollPosition = 0;

var ClientData = {
    DisplayIndexInternal: 1,
    DisplayIndexListener: function(val){},
    set DisplayIndex(val){
        this.DisplayIndexInternal = val;
        this.DisplayIndexListener(val);
    },
    get DisplayIndex(){
        return this.DisplayIndexInternal;
    },
    registerListener: function(listner){
        this.DisplayIndexListener = listner;
    }
}

var PreviousIndex = ClientData.DisplayIndex;
var NextIndex = ClientData.DisplayIndex + 1;

var PageState = document.body.getAttribute("data-Target");

