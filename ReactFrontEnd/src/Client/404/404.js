import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';



function ErrorPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    return (
        <div style={{color:"white", width:"100%", height:"100%", marginTop:"20vh", display:"flex", flexDirection:"column"}}>
            <p>404 Page not Found</p>
            <button onClick={(e)=>{navigate(from, {replace: true});}}>Return</button>
        </div>
    );
}

export {ErrorPage};