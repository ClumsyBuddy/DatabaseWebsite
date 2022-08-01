import { useContext } from "react";
import { SocketContext } from "../Client/context/socket";

const useSocket = () => {
    return useContext(SocketContext);
}

export default useSocket;