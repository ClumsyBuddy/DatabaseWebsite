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

var Week = 7 * 24 * 60 * 60 * 1000; //How long session token will remain
const SessionMiddleWare = session({ //Create session middleware
    store: new SQLiteStore,
    secret: 'DBSession',
    resave: false,
    saveUninitialized:true,
    cookie: { maxAge: Week, secure:false } // 1 week
});

const io = new Server(server, {
    allowRequest: (req, callback) => {
      // with HTTP long-polling, we have access to the HTTP response here, but this is not
      // the case with WebSocket, so we provide a dummy response object
      const fakeRes = {
        getHeader() {
          return [];
        },
        setHeader(key, values) {
          req.cookieHolder = values[0];
        },
        writeHead() {},
      };
      SessionMiddleWare(req, fakeRes, () => {
        if (req.session) {
          // trigger the setHeader() above
          fakeRes.writeHead();
          // manually save the session (normally triggered by res.end())
          req.session.save();
        }
        callback(null, true);
      });
    },
});

io.engine.on("initial_headers", (headers, req) => {
if (req.cookieHolder) {
    headers["set-cookie"] = req.cookieHolder;
    delete req.cookieHolder;
}
});


app.use(SessionMiddleWare);

// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// io.use(wrap(SessionMiddleWare));


const corsOptions = {
origin: "*",
optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
//Setup Json and URL parsing
app.use(express.json()); // Helps Parse Json files
app.use(express.urlencoded({ //Parse POST 
    extended:true
}));
app.set("trust proxy", true);
import sqlite3 from "sqlite3";

import {Database} from "../Server/Database/Database.js";
import {DatabaseManager} from "../Server/Database/DatabaseManager.js";
import {Login} from "../Server/DBClasses/Login/LoginHandler.js";
import { ResponseHandler } from "../Server/Response/ResponseHandler.js";

//Create variables for exported Classes
const db = new Database("./Main.db");
//Main Database
const MainDB = new DatabaseManager(db);
//Login Manager
const UserLogin = new Login(MainDB);


const BaseEntry = "sku TEXT, brand TEXT, itemtype TEXT, active INTEGER"
const ReponseHandler = new ResponseHandler(
  MainDB, 
  {
    Sable:{
        ClassAutoColumn:BaseEntry,
        CACIndex:3,
        DBController:MainDB
    },
    Diplomat:{
      ClassAutoColumn:BaseEntry,
      CACIndex:3,
      DBController:MainDB
    }
  }
);


var Classes = {
    db:db,
    MainDB:MainDB,
    UserLogin:UserLogin,
    ReponseHandler:ReponseHandler
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
};
