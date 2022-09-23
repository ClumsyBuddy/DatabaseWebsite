import React, { useEffect, useRef, useState } from 'react';
import useSocket from "../../../../hooks/useSocket";

import "./ImportModal.css";

const ImportModal = ({...props}) => {

    

    return (
        <React.Fragment>
            <div id='Overlay' className='Overlay'>
                <button className='CloseButton' onClick={(e)=>{props.setIsOpen(false);}}>&times;</button>
                <div className='Container'>
                    <div className='TopBar'>
                        <label>Please Select File to Import</label>
                        <input type={"file"} accept={".csv"}></input>
                    </div>
                    <div className='BottomBar'>
                        
                    </div>
                </div>
            </div>
        </React.Fragment>
    );


}


export default ImportModal;