import {Route, Routes} from "react-router-dom"

import Layout from './layout';

import Login from "./Login/LoginPage";
import Sable from "./Sable/Sable";
import LinkPage from './link/LinkPage';


import './App.css';


function App() {
  return (
    <div className="BaseContainer">
      <Routes>
      <Route path='/' element={<Layout/>}>
          <Route path='Sable' element={<Sable/>} exact />
          <Route path="/" element={<LinkPage />} />
          <Route path="/Login" element={<Login/>} />
      </Route>
    </Routes>
  </div>
  );
}


export default App;
