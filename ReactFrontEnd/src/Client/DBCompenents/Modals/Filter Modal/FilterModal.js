import React, { useEffect, useRef, useState } from 'react'

import "./FilterModal.css";



function FilterModal(props){

    const [Brands, setBrands] = useState([]);
    const [Types, setTypes] = useState([]);
    


    const mounted = useRef(false);

    useEffect(()=>{
        const FetchData = () => {
            fetch("/FilterData", {
                method:"GET",
                headers: {"Content-Type": "application/JSON"},
              })
              .then(res => {
                return res.json();
              })
              .then(data => {
                console.log(data);
                setTypes(data.ItemData);
                setBrands(data.Brand);
            });
        }
        if(!mounted.current){
            FetchData();
        }
        mounted.current = true;
    }, []);

    const RenderBrand = Brands.map((brands) => {
        return (
            <>
                {props.selectedFilters.Brand === brands ? props.selectedFilters.Brand !== "" ? <option selected>{brands}</option> : <option>{brands}</option> : <option>{brands}</option>}
            </>
        )
    });
    const RenderItemTypes = Types.map((type) => {
        return (
            <>
                {props.selectedFilters.Type === type.ItemType ? props.selectedFilters.Type !== "" ? <option selected>{type.ItemType.replace(/_/g, " ")}</option> : <option>{type.ItemType.replace(/_/g, " ")}</option> : <option>{type.ItemType.replace(/_/g, " ")}</option>}
            </>
        )
    });

    return (
        <React.Fragment>
            <div className='FilterPopUp'>
                <div className='InnerElements'>
                <button className='FilterCloseButton' onClick={(e)=>{props.setIsOpen(false);}}>&times;</button>
                    <select style={{textAlign:'center'}} className="BrandFilter" onChange={(e) => { let _new = props.selectedFilters; _new.Brand = e.currentTarget.value; props.updateSelected(_new); }}>
                        {props.selectedFilters.Brand === "" ? <option selected disabled hidden>{RenderBrand.length === 0 ? "Loading..." : "Brand Filter"}</option> : <></>}
                        <option value={""}>None</option>
                        {RenderBrand}
                    </select>
                    <select style={{textAlign:'center'}} className="BrandFilter" onChange={(e) => { let _new = props.selectedFilters; _new.Type = e.currentTarget.value.replace(/ /g, "_"); props.updateSelected(_new); }}>
                        {props.selectedFilters.Type === "" ? <option selected disabled hidden>{RenderItemTypes.length === 0 ? "Loading..." : "Type Filter"}</option> : <></>}
                        <option value={""}>None</option>
                        {RenderItemTypes}
                    </select>
                </div>
                
                <button className='FakeSubmitButton ButtonHoverEffect' onClick={(e)=>{props.setIsOpen(false);}}>Submit</button>
            </div>
        </React.Fragment>
    )
}


export default FilterModal;