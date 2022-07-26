import React, { useState } from 'react';
import {useNavigate} from "react-router-dom"

import useAuth from '../../hooks/useAuth';
import ProductList from '../DBCompenents/ProductList';


import "./Sable.css";

function Sable(){
    const {auth} = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const returnToSender = () => {
        navigate("/", {replace:true});
    }



    return (
        <div className='SableBaseContainer'>
           
            <button onClick={returnToSender} className='BackButton'>Back</button>
               
            <h1 className='TitleHeader'>Hello World</h1>
          
            <div className='MenuNav'>
                <button className='AddButton Marg MenuButton'>Add</button>
                <textarea className='SearchBar Marg' placeholder='Enter Sku' cols={25} rows={1} onChange={(e)=>{setSearch(e.target.value);}}></textarea>
                <button className='SearchButton Marg MenuButton'>Search</button>
            </div>

            <div className='SableProductListContainer'>

                <ProductList/>

            </div>


        </div>
    );
}


export default Sable;