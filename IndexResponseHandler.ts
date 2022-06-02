import { application } from "express";
import { DatabaseManager } from "./DatabaseManager";
import { Login } from "./LoginHandler";
import { ResponseHandler } from "./ResponseHandler";


class IndexResponseHandler extends ResponseHandler{
    constructor(DbController:DatabaseManager, User:Login, app:any){
            super(DbController, User);
    }

    


}

export {IndexResponseHandler};