import React, {} from 'react';


import axios from "axios";

import "./ImportModal.css";

const ImportModal = ({...props}) => {


    const ReadFile = (file) => {
        const data = new FormData();
        data.append("file", file[0]);
        axios.post("/ImportFile", data).then(res => {
            console.log(res.data);
        });
    }

    return (
        <React.Fragment>
            <div id='Overlay' className='Overlay'>
                <button className='CloseButton' onClick={(e)=>{props.setIsOpen(false);}}>&times;</button>
                <div className='Container'>
                    <div className='TopBar'>
                        <label htmlFor='import'>Please Select File to Import</label>
                        <input className='ChooseFile' id="import" type={"file"} accept={".csv"} onChange={(e)=>{ReadFile(e.target.files);}}></input>
                    </div>
                    <div className='BottomBar'>
                        
                    </div>
                </div>
            </div>
        </React.Fragment>
    );


}


export default ImportModal;