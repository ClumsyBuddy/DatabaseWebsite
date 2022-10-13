



export async function CleanData(dirtyData){
    var SavedSKU = [];
    var cleaned = [];
    console.log(dirtyData.length);
    for (let i = 0; i < dirtyData.length; i++) {
        const obj = dirtyData[i];
        if(SavedSKU.includes(obj.SKU)){
            cleaned.forEach((e) => {
                if(e.SKU === obj.SKU){
                    if(obj.VSKU !== ""){
                        e.Variant.push({VSKU: obj.VSKU, Active: obj.ImageAlt.includes("_Hide_") ? false : true});
                    }
                }
            })
        }else{
            SavedSKU.push(obj.SKU);
            let FilteredTags = obj.Tags.split(",").filter((e) => { return !e.includes("_")});
            let stat = obj.Status === "active" ? true : false;

            let isUniform = false;
            for(let t of FilteredTags){
                if(t.includes("Uniform")){
                    isUniform = true;
                }
            }

            cleaned.push({SKU: obj.SKU, Tags: FilteredTags, Variant: [{VSKU:obj.VSKU, Active:stat}], Status: obj.Status, Uniform:isUniform});
        }
    }
    return cleaned;
}