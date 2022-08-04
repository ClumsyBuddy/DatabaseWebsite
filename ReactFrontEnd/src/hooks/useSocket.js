import { useContext } from "react";
import { SocketContext } from "../Client/context/SocketProvider";

const useSocket = () => {
    return useContext(SocketContext);
}

export default useSocket;