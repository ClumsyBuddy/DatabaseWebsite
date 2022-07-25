import React from 'react';
import "./Header.css";
import logo from '../logo.svg';
function Header(){

    return (
        <div className='NavBar'>
            <a className='NavBarButton' href='/Sable'>Sable</a>
            <a className='NavBarButton' href='/Diplomat'>Diplomat</a>
            <a className='NavBarButton' href='/RDI'>RDI</a>
            <a className='NavBarButton' href='/Logout'>Logout</a>
            <img src={logo} className="App-logo" alt="logo" />
        </div>
    );

}

export default Header;