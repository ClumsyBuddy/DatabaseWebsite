//let express = require('express');
import express from "express";
//let ip = require('ip');
import ip from "ip";
//let session = require('express-session');
import session from "express-session";
//let SQLiteStore = require('connect-sqlite3')(session);
import {default as SQLiteStoreSession} from "connect-sqlite3";
const SQLiteStore = SQLiteStoreSession(session);
let app = express();
//let http = require('http');
import http from "http";
let server = http.createServer(app);
//let Server = require("socket.io").Server;
import * as Server from "socket.io";
let io = new Server.Server(server);
//const sqlite3 = require('sqlite3');
import sqlite3 from "sqlite3";

app.set('views', "./Server/views");
app.set('view engine', 'ejs');
//Setup Json and URL parsing
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));

let Public = "./public";
app.use(express.static(Public));
app.use('/uploads', express.static(Public));
app.use('/javascript', express.static(Public));
app.use('/CSS', express.static(Public));

//const {Database} = require("../Server/Database/Database.js");
//const {DatabaseManager} = require("../Server/Database/DatabaseManager");
//const {SableResponseHandler} = require("../Server/DBClasses/Sable/SableResponseHandler");
//const {DiploResponseHandler} = require("../Server/DBClasses/Diplomat/DiploResponseHandler");
//const {Login} = require("../Server/DBClasses/Login/LoginHandler");
//const {IndexResponseHandler} = require("../Server/DBClasses/Index/IndexResponseHandler");

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
    http,
    server,
    io,
    SQLiteStore,
    session,
    ip,
    express,
    Classes,
    sqlite3
};
