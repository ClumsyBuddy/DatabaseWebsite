import { useContext } from "react";
import AuthContext from "../Client/context/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;