import { Outlet, Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const PrivateRoutes = () =>{
    
    const {auth} = useAuth();
    
    return (
        auth.token ? <Outlet/> : <Navigate to="/" />
    );
}

export default PrivateRoutes