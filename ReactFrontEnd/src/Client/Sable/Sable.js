import React, { Suspense, useState } from 'react';
import {useNavigate} from "react-router-dom"
import "./Sable.css";

const DisplayList = React.lazy(() => import('../DBCompenents/DisplayList'));

function Sable(){
    const navigate = useNavigate();
    const returnToSender = () => {
        navigate("/", {replace:true});
    }
    const [Query, setQuery] = useState("");
    
    const UpdateQuery = (value) =>{
        setQuery(value);
    }
    
    
    return (
        <div className='SableBaseContainer'>
           
            <button onClick={returnToSender} className='BackButton'>Back</button>
               
            <h1 className='TitleHeader'>Sable</h1>
          
            <div className='MenuNav'>
                <button className='AddButton Marg MenuButton'>Add</button>
                <textarea id="SearchBar" className='SearchBar Marg' placeholder='Enter Sku' cols={25} rows={1} onChange={(e)=>{UpdateQuery(e.currentTarget.value);}}></textarea>
                <button type='submit' className='SearchButton Marg MenuButton' onClick={(e)=>{document.getElementById("SearchBar").value = ""; UpdateQuery("");}}>Clear</button>
            </div>

            <div className='SableProductListContainer'>
                <Suspense fallback={<div>Loading...</div>}>
                    <DisplayList Query={Query} />
                </Suspense>
            </div>


        </div>
    );
}


export default Sable;