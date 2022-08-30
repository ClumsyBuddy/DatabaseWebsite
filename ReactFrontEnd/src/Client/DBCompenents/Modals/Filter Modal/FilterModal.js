import React from 'react'

import "./FilterModal.css";



function FilterModal(props){




    return (
        <React.Fragment>
            <div className='FilterPopUp'>
                <button className='FilterCloseButton' onClick={(e)=>{props.setIsOpen(false);}}>&times;</button>
                <div className='InnerElements'>
                    <select style={{textAlign:'center'}} className="BrandFilter">
                        <option selected disabled hidden>Brand Filter</option>
                        <option>CLA</option>
                        <option>CLAP</option>
                        <option>MST</option>
                    </select>
                    <select style={{textAlign:'center'}} className="BrandFilter">
                        <option selected disabled hidden>Type Filter</option>
                        <option>Uniform</option>
                        <option>BusinessCard</option>
                        <option>SomethingElse</option>
                    </select>
                </div>
            </div>
        </React.Fragment>
    )
}


export default FilterModal;