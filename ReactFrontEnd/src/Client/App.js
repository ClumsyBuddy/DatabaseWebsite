import {Route, Routes} from "react-router-dom"

import Layout from './layout';
import RequireAuth from "./Util/RequiredAuth";

import Login from "./Login/LoginPage";
import LinkPage from './link/LinkPage';
import { SocketContext, socket } from "./context/SocketProvider";

import './App.css';
import { ErrorPage } from "./404/404";
import DataBaseMenu from "./DataBaseMenu/DataBaseMenu";


function App() {
  return (
    <div className="BaseContainer">
      <SocketContext.Provider value={socket}>
        <Routes>
        <Route path='/' element={<Layout/>}>
          <Route element={<RequireAuth login={true} />}>
            <Route path='Sable' element={<DataBaseMenu DB="Sable" />} exact />
            <Route path='Diplomat' element={<DataBaseMenu DB="Diplomat" />} exact />
            <Route path='RDI' element={<DataBaseMenu DB="RDI" />} exact />
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
