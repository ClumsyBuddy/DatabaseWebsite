import React, { Suspense, useState } from 'react';
import {useNavigate} from "react-router-dom"
import AddModal from '../DBCompenents/Modals/AddModal/AddModal';
import FilterModal from '../DBCompenents/Modals/Filter Modal/FilterModal';


import "./DataBaseMenu.css";


const DisplayList = React.lazy(() => import('../DBCompenents/DisplayList'));
const tooltipSVG = "M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-4.1a1.1 1.1 0 1 0 .001 2.201A1.1 1.1 0 0 0 10 13.9M10 4C8.625 4 7.425 5.161 7.293 5.293A1.001 1.001 0 0 0 8.704 6.71C8.995 6.424 9.608 6 10 6a1.001 1.001 0 0 1 .591 1.808C9.58 8.548 9 9.616 9 10.737V11a1 1 0 1 0 2 0v-.263c0-.653.484-1.105.773-1.317A3.013 3.013 0 0 0 13 7c0-1.654-1.346-3-3-3"

function DataBaseMenu({...props}){
    const navigate = useNavigate();
    const returnToSender = () => {
        navigate("/", {replace:true});
    }
    const [Query, setQuery] = useState("");

    const [AddModelisOpen, AddModelsetIsOpen] = useState(false);
    const [FilterModalisOpen, FilterModalsetIsOpen] = useState(false);
    const [SelectedFitlers, setSelectedFilters] = useState({Brand:"", Type:""});
    const [showToolTip, setShowToolTip] = useState(false);


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
               
            <h1 className='TitleHeader' style={{pointerEvents:"none"}}>{props.DB}</h1>
          
            <div className='MenuNav'>
                <button className='AddButton Marg MenuButton ButtonHoverEffect' onClick={(e) => {AddModelsetIsOpen(true);}}>Add</button>
                <textarea id="SearchBar" style={{marginRight:".25%"}} className='SearchBar Marg ' placeholder='Search...' cols={25} rows={1} onChange={(e)=>{UpdateQuery(e.currentTarget.value);}}></textarea>
                <div style={{position:"relative"}}>
                <svg onMouseEnter={(ev)=>{setShowToolTip(true)}} onMouseLeave={(ev)=>{setShowToolTip(false)}} style={{height:"20px", width:"20px"}}><path fill='black' d={tooltipSVG} ></path></svg>
                {!showToolTip ? <></> :  <div style={{width:"600px", backgroundColor:"white", height:"30px", position:"absolute", borderRadius:"5px", left:"25px", top:"0"}}>
                                            <p style={{fontSize:"15px", color:"black", lineHeight:"0px", paddingLeft:"5px", paddingRight:"5px", fontWeight:"500"}}>You can input anything related to the product. Such as color, SKU and even the brand!</p>
                                        </div>}
                </div>
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


export default DataBaseMenu;