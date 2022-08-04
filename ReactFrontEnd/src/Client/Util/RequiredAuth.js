import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ login }) => {
    const {auth} = useAuth();
    const location = useLocation();

    return (
        auth?.login === login
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/Login" state={{ from: location }} replace />
    );
}

export default RequireAuth;