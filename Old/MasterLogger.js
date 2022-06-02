class MasterLogger{
    constructor(){
        //Need to add database to store logs in
        this.LogItems = [];
    }

    AddLog(Log){
        this.LogItems.push(Log);
    }
    Print(){
        for(var key in this.LogItems){
            console.log(this.LogItems[key]);
        }
    }


}


module.exports = MasterLogger;