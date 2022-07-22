import React, { useEffect, useState } from 'react';
import { Login } from "./Login/LoginPage";
import { Header } from './Header/Header';


import './App.css';


import {io} from "socket.io-client";
const socket = io("http://192.168.1.123:8000")

function App() {

  var [data, setData] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
    socket.on("Counter", (data) => {
        setData(data);
    }, []);
  });
 
  return (
    <div className="App">
      <header className='App-Header'>
        <Header />
      </header>
      <Login />
      <p>Database Uptime: {!data ? "Loading..." : data + " Seconds"}</p>
    </div>
  );
}


export default App;
