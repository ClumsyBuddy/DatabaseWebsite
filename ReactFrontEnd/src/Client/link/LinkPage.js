
import React, {useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom"


import useSocket from "../../hooks/useSocket";
import useAuth from "../../hooks/useAuth";

import "./LinkPage.css";
import { Init, start } from "./SineWave";



const LinkPage = () => {

    const socket = useSocket();

    const {setAuth, auth} = useAuth();

    const [counter, setCounter] = useState("");

    const canvasref = useRef(null);

    const [mounted, setMounted] = useState(false);


    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        setMounted(true);
        const canvas = canvasref.current;
        Init(canvas);
        start(canvas);
        socket.on("connect", ()=>{setIsConnected(true);})
        socket.on("disconnect", ()=>{setIsConnected(false);})
        socket.on("Counter", (msg) =>{setCounter(msg);})


        socket.emit("is_login", (response) =>{
            console.log("Response: " + response);
        });

        return () =>{
            socket.off("connect");
            socket.off("disconnect");
            socket.off("Counter");
        }
        //eslint-disable-next-line
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
                <Link className="dbLink" to="/Sable">SABLE</Link>
                <Link className="dbLink" to="/Diplomat">DIPLOMAT</Link>
                <Link className="dbLink" to="/RDI">RDI</Link>
            </div>
            <p style={{color:"white", zIndex:1}} className="Counter TextStroke">{!counter ? "Loading..." : counter + " seconds"}</p>
        </section>
    )
}

export default LinkPage