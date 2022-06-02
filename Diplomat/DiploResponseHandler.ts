import { DatabaseManager } from "../DatabaseManager";
import { ResponseHandler } from "../ResponseHandler";





class DiploResponseHandler extends ResponseHandler{
    ItemType:{
        Coffe:0,
        CoffeMaker:1,
    }
    constructor(DBController:DatabaseManager){
        super(DBController);
    }

}





export {DiploResponseHandler};