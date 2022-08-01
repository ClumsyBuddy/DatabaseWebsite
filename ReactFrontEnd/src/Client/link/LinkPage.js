
import React, {useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom"
import { io } from "socket.io-client";


import useAuth from "../../hooks/useAuth";

import "./LinkPage.css";
import { Init, start } from "./SineWave";


const socket = io("http://192.168.1.123:8000/");

const LinkPage = () => {

    const {setAuth, auth} = useAuth();

    const [counter, setCounter] = useState("");

    const canvasref = useRef(null);

    useEffect(() => {

        const canvas = canvasref.current;
        Init(canvas);
        start(canvas);
        
        socket.on("Counter", (msg) =>{setCounter(msg);})

        return () =>{
            socket.off("Counter");
        }
    }, []);

    const ClearAuth = async () => {
        
        setAuth({});
    }

    return (
        <section className="BaseContainer">
            <canvas id="sineWaveCanvas" className="SineWaveCanvas" ref={canvasref} width={"1920px"} height={"1080px"} ></canvas>
            {!auth?.login ? <Link className="LoginButton" to="/Login">Login</Link> : <button onClick={ClearAuth} className="LogoutButton">Logout</button>}
            <h1 className="DataBaseHeader">Databases</h1>
            <div className="dbContainer">
                <Link className="dbLink" to="/Sable">Sable</Link>
                <Link className="dbLink" to="/Diplomat">Diplomat</Link>
                <Link className="dbLink" to="/RDI">RDI</Link>
            </div>
            <p style={{color:"white", zIndex:1}} className="Counter TextStroke">{!counter ? "Loading..." : counter}</p>
        </section>
    )
}

export default LinkPage