class ItemData{
    public ItemType:string;
    public Options:Array<any>;
    public Values:Array<any>;
    constructor(_ItemType){
        this.ItemType = _ItemType;
        this.Options = [];
    }
    public AddOptions(_option:any, values:Array<string>){
        this.Options.push({[_option]: values});
    }
}



export {ItemData};