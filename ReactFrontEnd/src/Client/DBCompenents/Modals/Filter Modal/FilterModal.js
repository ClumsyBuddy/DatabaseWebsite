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
                <option>{brands}</option>
            </>
        )
    });
    const RenderItemTypes = Types.map((type) => {
        return (
            <>
                <option>{type.ItemType.replace(/_/g, " ")}</option>
            </>
        )
    });

    return (
        <React.Fragment>
            <div className='FilterPopUp'>
                <button className='FilterCloseButton' onClick={(e)=>{props.setIsOpen(false);}}>&times;</button>
                <div className='InnerElements'>
                    <select style={{textAlign:'center'}} className="BrandFilter" onChange={(e) => { let _new = props.selectedFilters; _new.Brand = e.currentTarget.value; props.updateSelected(_new); }}>
                        <option selected disabled hidden>Brand Filter</option>
                        <option>None</option>
                        {RenderBrand}
                    </select>
                    <select style={{textAlign:'center'}} className="BrandFilter" onChange={(e) => { let _new = props.selectedFilters; _new.Type = e.currentTarget.value.replace(/ /g, "_"); props.updateSelected(_new); }}>
                        <option selected disabled hidden>Type Filter</option>
                        <option>None</option>
                        {RenderItemTypes}
                    </select>
                </div>
                <button className='FakeSubmitButton' onClick={(e)=>{props.setIsOpen(false);}}>Submit</button>
            </div>
        </React.Fragment>
    )
}


export default FilterModal;