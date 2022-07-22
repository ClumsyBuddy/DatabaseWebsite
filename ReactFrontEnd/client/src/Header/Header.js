import React from 'react';
import "./Header.css";
import logo from '../logo.svg';
function Header(){

    return (
        <div className='NavBar'>
            <img src={logo} className="App-logo" alt="logo" />
            <button className='NavBarButton'>Sable</button>
            <button className='NavBarButton'>Diplomat</button>
            <button className='NavBarButton'>RDI</button>
            <button className='NavBarButton'>Logout</button>
        </div>
    );

}

export {Header};