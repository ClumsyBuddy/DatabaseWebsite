import React, { Suspense, useState } from 'react';
import {useNavigate} from "react-router-dom"
import useAuth from '../../hooks/useAuth';
import "./Sable.css";

const ProductList = React.lazy(() => import('../DBCompenents/ProductList'));

function Sable(){
    const {auth} = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const returnToSender = () => {
        navigate("/", {replace:true});
    }

    const TestCheck = async () =>{
        console.log("SendTest");
        const result = await fetch("/Test", {
            method:"GET",
            headers: {"Content-Type": "application/JSON"},
          })
          .then(response =>{
            console.log(response);
            return response.json();
          });
          console.log(result);
    }

    return (
        <div className='SableBaseContainer'>
           
            <button onClick={returnToSender} className='BackButton'>Back</button>
               
            <h1 className='TitleHeader'>Sable</h1>
          
            <div className='MenuNav'>
                <button className='AddButton Marg MenuButton' onClick={TestCheck}>Add</button>
                <textarea className='SearchBar Marg' placeholder='Enter Sku' cols={25} rows={1} onChange={(e)=>{setSearch(e.target.value);}}></textarea>
                <button className='SearchButton Marg MenuButton'>Search</button>
            </div>

            <div className='SableProductListContainer'>
                <Suspense fallback={<div>Loading...</div>}>
                    <ProductList/>
                </Suspense>
            </div>


        </div>
    );
}


export default Sable;