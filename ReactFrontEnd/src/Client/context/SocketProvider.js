import React from "react";
import { io } from "socket.io-client";


export const socket = io.connect('http://192.168.1.123:8000/', {transports: ['websocket']});
export const SocketContext = React.createContext();