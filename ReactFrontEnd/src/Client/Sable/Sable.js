import React, { Suspense } from 'react';
import {useNavigate} from "react-router-dom"
import "./Sable.css";

const ProductList = React.lazy(() => import('../DBCompenents/ProductList'));

function Sable(){
    const navigate = useNavigate();
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
                <textarea className='SearchBar Marg' placeholder='Enter Sku' cols={25} rows={1} onChange={(e)=>{}}></textarea>
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