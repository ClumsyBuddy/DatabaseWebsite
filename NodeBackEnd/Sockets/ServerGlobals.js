import express from "express";
import ip from "ip";
import session from "express-session";
import {default as SQLiteStoreSession} from "connect-sqlite3";
let SQLiteStore = SQLiteStoreSession(session);
import {createServer} from "http";
let app = express();
let server = createServer(app);
import {Server} from "socket.io";
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
import sqlite3 from "sqlite3";
app.set('views', "./Server/views");

app.set('view engine', 'ejs');
//Setup Json and URL parsing
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));

const Public = "./public";
app.use(express.static(Public));
app.use('/uploads', express.static(Public));
app.use('/javascript', express.static(Public));
app.use('/CSS', express.static(Public));

import {Database} from "../Server/Database/Database.js";
import {DatabaseManager} from "../Server/Database/DatabaseManager.js";
import { SableResponseHandler } from "../Server/DBClasses/Sable/SableResponseHandler.js";
import {DiploResponseHandler} from "../Server/DBClasses/Diplomat/DiploResponseHandler.js";
import {Login} from "../Server/DBClasses/Login/LoginHandler.js";
import {IndexResponseHandler} from "../Server/DBClasses/Index/IndexResponseHandler.js";

//Create variables for exported Classes
const db = new Database("./Main.db");
//Main Database
const MainDB = new DatabaseManager(db);
//Login Manager
const UserLogin = new Login(MainDB);

const Index = new IndexResponseHandler(MainDB, UserLogin, io);
const Sable = new SableResponseHandler(MainDB, UserLogin, "Sable", io);
const Diplo = new DiploResponseHandler(MainDB, UserLogin, io);

var Classes = {
    db:db,
    MainDB:MainDB,
    UserLogin:UserLogin,
    Index:Index,
    Sable:Sable,
    Diplo:Diplo
}

export {
    app,
    server,
    io,
    SQLiteStore,
    session,
    ip,
    express,
    Classes,
    sqlite3
};
