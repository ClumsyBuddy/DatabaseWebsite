import React, {Fragment} from 'react';

import "./EditModal.css";


const  EditModal = ({flipOpen}) =>{
    return (
        <Fragment>
            <div id='Overlay' className='Overlay'>
            <button className='CloseButton' onClick={(e)=>{flipOpen(false)}}>&times;</button>
            <div id='Container' className='Container'>

                <h1>Hello Modal</h1>
    
            </div>
            
    
            </div>
        </Fragment>
    );
};



export default EditModal;