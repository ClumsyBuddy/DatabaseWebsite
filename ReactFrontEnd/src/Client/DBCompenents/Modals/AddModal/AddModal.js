import React from 'react';

import "../Modal.css";
import "./AddModal.css";



const AddModal = ({...props}) => {

    return (
        <React.Fragment>
            <div id='Overlay' className='Overlay'>
                <button className='CloseButton' onClick={(e)=>{props.setIsOpen(false)}}>&times;</button>
            <div id='Container' className='Container'>

                <h1>Add Modal</h1>
                <button>Submit</button>
            </div>
            </div>
        </React.Fragment>
    );


}



export default AddModal;