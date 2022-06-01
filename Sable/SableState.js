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
            Search:7,
            _ReRender:8
        }
        this.SectionId = "Base SKU";
        this.StateIndex = this.IndexTable.BaseDisplay;
        this.ProductId = '';
        this.ProductColor = '';
    }

    HandleMenuPost(index, Query, SableMenu){ //Simple State machine. Depending on what state we want we can flip between them using the indexTable
        switch(index){
            case this.IndexTable.BaseDisplay: /*  BASE DISPLAY  */
                this.SectionId = "Base SKU";
                this.StateIndex = this.IndexTable.BaseDisplay;
                this.SavePreviousState();
                break;
            case this.IndexTable.AllDispay: /*  ALL DISPLAY  */
                this.FindProducts = SableMenu.lookUpTable.All;  
                this.Query = Query
                this.MenuState.ListState = "BrandDisplay";
                this.SectionId = "Brands";
                this.StateIndex = this.IndexTable.AllDispay;
                this.SavePreviousState();
                break;
            case this.IndexTable.BrandDisplay:  /*  BRAND DISPLAY  */
                this.FindProducts = SableMenu.lookUpTable.Brand;
                this.Query = Query;
                this.MenuState.ListState = "ColorDisplay";
                this.SectionId = "Brand Colors";
                this.StateIndex = this.IndexTable.BrandDisplay;
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
                this.ProductId = Variables[0];
                this.ProductColor = Variables[1];
                break;
            case this.IndexTable.Cancel:    /*  CANCEL BUTTON  */
                //this.MenuState.ListState = "BaseDisplay";
                this.HandleMenuPost(this.StateIndex, this.Query, SableMenu);
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
                this.SectionId = "Search Results";
                break;
            case this.IndexTable._ReRender:
                this.Reset();
                this.ResetToPreviousState();
                break;
        }
    }

}

module.exports = SablePageState;