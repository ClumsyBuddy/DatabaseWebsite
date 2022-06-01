
class  PageStateManager{
    /**
     * 
     * @param {string} _PageTitle 
     * @param {string} _PageToRender 
     * @param {string} _Action 
     */
    #SaveBase;
    #PreviousState;
    constructor(_PageTitle, _PageToRender, _Action){
        this.Title = _PageTitle; //Title for header at top of page
            this.PageToRender = _PageToRender; //Location of the page
            this._Action = _Action;  //Tracked request 
            this.DisplayPopUp = false; //Display Popup menu
            this.ProductList = []; //Container for products to be displayed
            this.FindProducts = 0; //Determines whether to find by id or not
            this.Query =  ""; // Data to hold query                                             /*  NEED TO RENAME THESE, THE NAMING IS TERRIBLE AND ITS HARD TO TELL WHAT IT DOES  */
            this.MenuState = {ListState:"BaseDisplay", PopUpState:"Start", LoginState:"None"}; //List of States for the menu
            this.DisplayProductList = true; //Controls whether we show the list of products or not
            this.Optional = ""; //Allows up to check for a optional Variable (Was originally Color)
            this.Re_Render = false; //Chooses whether we rerender the previous page
            this.SectionId = "";
            this.#SaveBase = this.ReturnClassObject();
            this.#PreviousState = this.ReturnClassObject();
        }
    
    Reset(){ //Resets all values to values made at time of creation
        this.Title = this.#SaveBase.Title;
        this.PageToRender = this.#SaveBase.PageToRender;
        this._Action = this.#SaveBase._Action;
        this.DisplayPopUp = this.#SaveBase.DisplayPopUp;
        this.ProductList = this.#SaveBase.ProductList;
        this.FindProducts = this.#SaveBase.FindProducts;
        this.Query = this.#SaveBase.Query;
        this.MenuState = {ListState:this.#SaveBase.MenuState.ListState, PopUpState:this.#SaveBase.MenuState.PopUpState, LoginState:this.MenuState.LoginState};
        this.DisplayProductList = this.#SaveBase.DisplayProductList;
        this.SectionId = this.#SaveBase.SectionId,
        this.Optional = this.#SaveBase.Optional;
        this.Re_Render = this.#SaveBase.Re_Render;
    }
    ReturnClassObject(){    //Return All Class variables as a object
        return {
            Title: this.Title, 
            PageToRender: this.PageToRender, 
            _Action: this._Action,  
            DisplayPopUp: this.DisplayPopUp, 
            ProductList: this.ProductList,
            FindProducts: this.FindProducts,
            Query: this.Query,
            MenuState:  {ListState:this.MenuState.ListState, PopUpState:this.MenuState.PopUpState, LoginState:this.MenuState.LoginState},
            DisplayProductList: this.DisplayProductList,
            SectionId: this.SectionId,
            Optional: this.Optional,
            Re_Render: this.Re_Render
            
        }
    }
    SavePreviousState(){ //Updates PreviousState variable with new object with current values
        this.#PreviousState = this.ReturnClassObject();
    }
    ResetToPreviousState(){ //Resets value to the saved previous State
        this.Title = this.#PreviousState.Title;
        this.PageToRender = this.#PreviousState.PageToRender;
        this._Action = this.#PreviousState._Action;
        this.DisplayPopUp = this.#PreviousState.DisplayPopUp;
        this.ProductList = this.#PreviousState.ProductList;
        this.FindProducts = this.#PreviousState.FindProducts;
        this.Query = this.#PreviousState.Query;
        this.MenuState = this.#PreviousState.MenuState;
        this.DisplayProductList = this.#PreviousState.DisplayProductList;
        this.SectionId = this.#PreviousState.SectionId;
        this.Optional = this.#PreviousState.Optional;
        this.Re_Render = this.#PreviousState.Re_Render;
    }
    Print(){
        console.log("PageStateManager: " + JSON.stringify(this.#PreviousState))
    }
}

module.exports = PageStateManager;