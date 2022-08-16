import {Route, Routes} from "react-router-dom"

import Layout from './layout';
import RequireAuth from "./Util/RequiredAuth";

import Login from "./Login/LoginPage";
import Sable from "./Sable/Sable";
import LinkPage from './link/LinkPage';
import { SocketContext, socket } from "./context/SocketProvider";

import './App.css';
import { ErrorPage } from "./404/404";


function App() {
  return (
    <div className="BaseContainer">
      <SocketContext.Provider value={socket}>
        <Routes>
        <Route path='/' element={<Layout/>}>
          <Route element={<RequireAuth login={true} />}>
            <Route path='Sable' element={<Sable/>} exact />
          </Route>
          <Route path="/" element={<LinkPage />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="*" element={<ErrorPage/>} />
        </Route>
      </Routes>
    </SocketContext.Provider>
  </div>
  );
}


export default App;
