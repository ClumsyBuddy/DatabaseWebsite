const DBManager = require("./DatabaseManager");


class  ResponseHandler{
    DBController: any;
    constructor(DBController){
        this.DBController = DBController;
        }


}

export {ResponseHandler};