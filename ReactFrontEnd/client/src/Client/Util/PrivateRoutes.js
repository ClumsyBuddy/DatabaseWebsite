import { Outlet, Navigate } from "react-router-dom";

import { BACKEND_URL } from "../../constants";

const PrivateRoutes = () =>{
    
    let auth = {"token":false};
    const Session = async() => {
    const response = await fetch(BACKEND_URL + "/Session")
        .then(response => {
            if(response.status !== 200){
                console.log("Error: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            return data;
        });
    }
    Session();
    return (
        auth.token ? <Outlet/> : <Navigate to="/" />
    );
}



export default PrivateRoutes