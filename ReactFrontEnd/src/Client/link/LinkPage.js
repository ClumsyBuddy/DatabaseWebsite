
import React, {useEffect, useRef} from "react";
import { Link } from "react-router-dom"

import useAuth from "../../hooks/useAuth";

import "./LinkPage.css";
import { Init, start } from "./SineWave";


const LinkPage = () => {

    const {setAuth, auth} = useAuth();

    const canvasref = useRef(null);

    useEffect(() => {

        const canvas = canvasref.current;
        Init(canvas);
        start(canvas);
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
                <script src="./SineWave.js"></script>
            </div>
        </section>
    )
}

export default LinkPage