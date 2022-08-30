import React, { Suspense, useState } from 'react';
import {useNavigate} from "react-router-dom"
import AddModal from '../DBCompenents/Modals/AddModal/AddModal';
import FilterModal from '../DBCompenents/Modals/Filter Modal/FilterModal';


import "./Sable.css";


const DisplayList = React.lazy(() => import('../DBCompenents/DisplayList'));


function Sable(){
    const navigate = useNavigate();
    const returnToSender = () => {
        navigate("/", {replace:true});
    }
    const [Query, setQuery] = useState("");

    const [AddModelisOpen, AddModelsetIsOpen] = useState(false);
    const [FilterModalisOpen, FilterModalsetIsOpen] = useState(false);
    const [SelectedFitlers, setSelectedFilters] = useState({Brand:"", Type:""});

    const UpdateQuery = (value) =>{
        setQuery(value);
    }
    const UpdateSelected = (Selected) => {
        console.log(Selected);
        if(Selected.Brand === "None"){
            Selected.Brand = "";
        }
        if(Selected.Type === "None"){
            Selected.Type = "";
        }
        setSelectedFilters(Selected);
    }
    
    return (
        <div className='SableBaseContainer'>
           
            <button onClick={returnToSender} className='BackButton ButtonHoverEffect'>Back</button>
               
            <h1 className='TitleHeader'>Sable</h1>
          
            <div className='MenuNav'>
                <button className='AddButton Marg MenuButton ButtonHoverEffect' onClick={(e) => {AddModelsetIsOpen(true);}}>Add</button>
                <textarea id="SearchBar" className='SearchBar Marg ' placeholder='Enter Sku' cols={25} rows={1} onChange={(e)=>{UpdateQuery(e.currentTarget.value);}}></textarea>
                <button type='submit' className='SearchButton Marg MenuButton ClearButton ButtonHoverEffect' onClick={(e)=>{document.getElementById("SearchBar").value = ""; UpdateQuery(""); setSelectedFilters({Brand:"", Type:""});}}>Clear</button>
                <button type='submit' className='MenuButton ButtonHoverEffect' onClick={(e)=>{FilterModalsetIsOpen(!FilterModalisOpen);}}>Filter</button>

            </div>

            <div className='SableProductListContainer'>
                <Suspense fallback={<div style={{color:"white"}}>Loading...</div>}>
                    <DisplayList Query={Query} Filter={SelectedFitlers}/>
                </Suspense>
                {FilterModalisOpen ? <FilterModal setIsOpen={FilterModalsetIsOpen} selectedFilters={SelectedFitlers} updateSelected={UpdateSelected} /> : <></>}
                {AddModelisOpen ? <AddModal setIsOpen={AddModelsetIsOpen} /> : <></>}
            </div>


        </div>
    );
}


export default Sable;