class ItemData {
    constructor(_ItemType) {
        this.ItemType = _ItemType;
        this.Options = [];
    }
    AddOptions(_option, values) {
        this.Options.push({ [_option]: values });
    }
}
export { ItemData };
