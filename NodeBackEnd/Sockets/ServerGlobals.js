import express from "express";
import ip from "ip";
import session from "express-session";
import cors from "cors";
import {default as SQLiteStoreSession} from "connect-sqlite3";
let SQLiteStore = SQLiteStoreSession(session);

SQLiteStore.prototype.all = function(fn){
    this.db.all("SELECT * FROM " + this.table, (err, result) => {
        if(err) fn(err);
        if(!result) return fn();
        let ParsedResult = [];
        result.map((item, i) => {
            ParsedResult.push({sid:item.sid, expired:item.expired, sess:JSON.parse(item.sess)})
        });
        fn(null, ParsedResult);
    });
}

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


var Week = 7 * 24 * 60 * 60 * 1000; //How long session token will remain
const SessionMiddleWare = session({ //Create session middleware
    store: new SQLiteStore,
    secret: 'DBSession',
    resave: false,
    saveUninitialized:true,
    cookie: { maxAge: Week } // 1 week
});
io.use(function(socket, next){SessionMiddleWare(socket.request, {}, next);});
app.use(SessionMiddleWare); //Use middleware


app.use(cors());
//Setup Json and URL parsing
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));

import {Database} from "../Server/Database/Database.js";
import {DatabaseManager} from "../Server/Database/DatabaseManager.js";
import { SableResponseHandler } from "../Server/DBClasses/Sable/SableResponseHandler.js";
import {DiploResponseHandler} from "../Server/DBClasses/Diplomat/DiploResponseHandler.js";
import {Login} from "../Server/DBClasses/Login/LoginHandler.js";

//Create variables for exported Classes
const db = new Database("./Main.db");
//Main Database
const MainDB = new DatabaseManager(db);
//Login Manager
const UserLogin = new Login(MainDB);

const Sable = new SableResponseHandler(MainDB, UserLogin, "Sable", io);
const Diplo = new DiploResponseHandler(MainDB, UserLogin, io);

var Classes = {
    db:db,
    MainDB:MainDB,
    UserLogin:UserLogin,
    Sable:Sable,
    Diplo:Diplo,
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
    sqlite3,
    cors
};
