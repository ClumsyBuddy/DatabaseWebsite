import React, { useEffect, useState } from 'react';


import axios from "axios";
import useSocket from '../../../../hooks/useSocket';


import "./ImportModal.css";

const ImportModal = ({...props}) => {
    const socket = useSocket();


    const [receivedData, setReceivedData] = useState([]);


    const ReadFile = (file) => {
        const data = new FormData();
        data.append("file", file[0]);
        axios.post("/ImportFile", data).then(res => {
            console.log(res.data);
        });
    }

    useEffect(() => {
        socket.on("CleanedData", (data) => {
            console.log(data.length);
            setReceivedData(data);
        })
        return () => {
            socket.off("CleanedData");
        }
    })
    

    const BuildProductCatalog = () => {
        return (
            <div className='ItemContainerWrapper' style={{marginTop:"10px"}}>
                {receivedData.map((item, i) => {
                    
                    return (
                        <div style={{borderStyle:"solid", borderRadius:"10px", marginBottom:"10px", paddingBottom:"10px", paddingLeft:"10px", paddingRight:"10px", width:"65%"}}>
                            <p style={{margin:"5px"}}>{item.SKU.replace("mws_apo_1_", "")}</p>
                            {item.Variant.length !== 0 ? item.Variant.map((v, i_v) => {
                                return <button style={{fontSize:"15px", height:"5%", maxWidth:"80%", marginRight:"10px"}} className="ButtonHoverEffect">{v.VSKU}</button>;
                            }) : <></>}
                            <br></br>
                            {item.Tags.map((tag, i_tag) => {
                                return <button style={{fontSize:"15px", height:"10%", maxWidth:"60%", marginRight:"10px"}} className="ButtonHoverEffect">{tag}</button>
                            })}
                            {/* <input type={"checkbox"}></input> */}
                        </div>
                    )
                })}
            </div>
        );
    }



    return (
        <React.Fragment>
            <div id='Overlay' className='Overlay'>
                <button className='CloseButton' onClick={(e)=>{props.setIsOpen(false);}}>&times;</button>
                <div className='Container'>
                {receivedData.length === 0 ? 
                    <div className='TopBar'>
                        <label htmlFor='import'>Please Select File to Import</label>
                        <input className='ChooseFile' id="import" type={"file"} accept={".csv"} onChange={(e)=>{ReadFile(e.target.files);}}></input>
                    </div>
                :    
                    <div className='BottomBarWrapper'>
                    {/* <button> Select All</button> */}
                    <p>Blah</p>
                    <div className='BottomBar'>
                            {BuildProductCatalog()} 
                    </div>
                    </div>
                }
                   
                    
                </div>
            </div>
        </React.Fragment>
    );


}


export default ImportModal;