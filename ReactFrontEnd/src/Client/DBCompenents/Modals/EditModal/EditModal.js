import React, {Fragment} from 'react';

import "../Modal.css"
import "./EditModal.css";


const  EditModal = ({flipOpen}) =>{
    return (
        <Fragment>
            <div id='Overlay' className='Overlay'>
            <button className='CloseButton' onClick={(e)=>{flipOpen(false)}}>&times;</button>
            <div id='Container' className='Container'>

                <h1>Edit Modal</h1>
    
            </div>
            
    
            </div>
        </Fragment>
    );
};



export default EditModal;