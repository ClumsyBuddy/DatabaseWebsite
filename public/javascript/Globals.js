/*
*   This file contains all Global Variables to be used in the code
*   A class with all of this would probably be better and or more easily maintained
*   But I dont feel like rewriting all of the variables in Main right now
*/



var BaseContainer = document.getElementById("ProductListContainer"); //Base Container for all products
var Add = document.getElementById("Add"); //Add button on page

var scrollLock = false; //Lock for timeout timer. Allows only one at a time
var ScrollDirection = {Up:false, Down:false}; //Direction we are scrolling
var PrevScrollPosition = 0; // Previous position

const ContainerLength = 100; //Max one index will show. We show two indexes
var ViewOffset = 5; //Element offset for visibility check

var ProductList = []; //List of all products parsed from Databse 
var ItemData = undefined;

//                       Object with ItemType String and array containing options, which are objects with arrays as the value.
// Data Design Pattern 1 {  ItemType:"Uniform", [  {Color:["RED"}, "BLUE"], { Size: [ "SMALL", "LARGE" ] }  ]  }




var ClientData = { //Saves Current index and sets a listener so we can automatically update NextIndex and Previous Index
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

var PageState = document.body.getAttribute("data-Target"); //Gets the current page state from the data-Target attribute on the body

