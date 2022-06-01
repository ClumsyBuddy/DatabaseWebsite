const PageStateManager = require('../PageStateManager');


class SablePageState extends PageStateManager{
    /**
     * 
     * @param {string} _PageTitle 
     * @param {string} _PageToRender 
     * @param {string} _Action 
     */
    constructor(_PageTitle, _PageToRender, _Action){
        super(_PageTitle, _PageToRender, _Action);
        this.IndexTable = {
            BaseDisplay:0,
            AllDispay:1,
            BrandDisplay:2,
            ColorDisplay:3,
            Cancel:4,
            Add:5,
            Edit:6,
            Search:7
        }
    }

    HandleMenuPost(index, Query, SableMenu){ //Simple State machine. Depending on what state we want we can flip between them using the indexTable
        console.log(Query);
        switch(index){
            case this.IndexTable.BaseDisplay: /*  BASE DISPLAY  */
                break;
            case this.IndexTable.AllDispay: /*  ALL DISPLAY  */
                this.FindProducts = SableMenu.lookUpTable.All;  
                this.Query = Query
                this.MenuState.ListState = "BrandDisplay";
                break;
            case this.IndexTable.BrandDisplay:  /*  BRAND DISPLAY  */
                this.FindProducts = SableMenu.lookUpTable.Brand;
                this.Query = Query;
                this.MenuState.ListState = "ColorDisplay";
                this.SavePreviousState();
                break;
            case this.IndexTable.ColorDisplay:  /*  COLOR DISPLAY  */
                this.DisplayPopUp = true;
                this.FindProducts = SableMenu.lookUpTable.Color;    
                this.MenuState.ListState = "PopUp";
                this.MenuState.PopUpState = "Edit";
                var Variables = Query.split(",");
                this.Query = Variables[0];
                this.Color = Variables[1];
                break;
            case this.IndexTable.Cancel:    /*  CANCEL BUTTON  */
                //this.MenuState.ListState = "BaseDisplay";
                this.Reset();
                this.ResetToPreviousState();
                break;
            case this.IndexTable.Add:   /*  ADD BUTTON  */
                this.DisplayPopUp = true;
                this.MenuState.PopUpState = "Add";
                break;
            case this.IndexTable.Edit:  /*  EDIT BUTTON  */
                break;
            case this.IndexTable.Search:    /*  SEARCH BUTTON  */
                this.FindProducts = SableMenu.lookUpTable.All;
                this.currentlySearch = true;
                this.Query = Query
                this.MenuState.ListState = "Search";
                break;
        }
    }

}

module.exports = SablePageState;