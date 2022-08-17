import React, { useEffect, useRef, useState } from 'react';
import useSocket from "../../../../hooks/useSocket";

import "../Modal.css";
import "./EditModal.css";

const EditModal = ({...props}) => {

    const socket = useSocket();


    const [ItemData, setItemData] = useState([]);
    const [selected, setSelected] = useState({});

    const mounted = useRef(false);

    useEffect(()=>{
        const FetchItemData = () => {
            fetch("/SpecificItemType", {
                method:"POST",
                headers: {"Content-Type": "application/JSON"},
                body: JSON.stringify({type:props.editProduct.itemtype}),
              })
              .then(res => {
                return res.json();
              })
              .then(data => {
                const AllOptions = data.Options;
                setItemData(AllOptions);
              });
        }
        

        if(!mounted.current){
            FetchItemData();
        }
        mounted.current = true;
    }, []);

    
    const SetChecked = (optionName, element) => {
        const Products = props.editProduct;
        if(Products[optionName] === null || Products[optionName] === "0" || Products[optionName] === 0){
            return false;
        }
        if(Products[optionName] === true || Products[optionName] === "true" || Products[optionName] === "1" || Products[optionName] === 1 || Products[optionName].includes(element)){
            return true;
        }
        return false;
    }

    const RenderOptions = () => {
        return (
            <div className='OList' style={{width:"50vw", height:"55vh", overflow:"scroll"}}>
            <label>
                {props.editProduct.itemtype}
            </label>
            <br></br>
            <label>{props.editProduct.sku.replace(/_/g, " ")}</label>
            <label>{props.editProduct.brand}</label>
            
            <div style={{width:"100%", height:"auto", display:"flex", 
                flexDirection:"row", justifyContent:"center", flexFlow:"wrap", overflow:"hidden"}}>
            {
                ItemData.map((option) => 
                {
                    let optionName = Object.keys(option)[0];
                    return (
                        <div style={{width:"20%", borderStyle:"solid", borderColor:"black", margin:"1%", borderRadius:"10px", padding:"10px", 
                                display:"block", fontSize:"20px"}}>
                                <label>{Object.keys(option)[0].replace(/_/g, " ")}: </label>
                                {
                                    option[optionName].map((element, i) => 
                                    {
                                        if(element === "" || element === true || element === false){
                                            return (<> {element === "" ? <label style={{textDecoration:"underline"}}>textbox</label> : <></>}
                                            <input type={"checkbox"} defaultChecked={SetChecked(optionName, element)} 
                                            className='ButtonHoverEffect ItemTypeButton' onChange={(e) => {let _new = selected; _new[optionName] = e.currentTarget.checked; setSelected(_new); console.log(selected); }}></input> </>
                                            );
                                        }
                                        return <>
                                            <label>{element}</label>
                                            <input type={"checkbox"} defaultChecked={SetChecked(optionName, element)} 
                                            className='ButtonHoverEffect ItemTypeButton' onChange={(e)=>
                                            {
                                                let _new = selected; 
                                                if(e.currentTarget.checked === false){
                                                    let toReplace = element + ",";
                                                    _new[optionName] = _new[optionName].replace(toReplace, "");
                                                }else{
                                                    if(_new[optionName] === undefined){
                                                        _new[optionName] = element + ",";
                                                    }else{
                                                        _new[optionName] += element + ',';
                                                    }
                                                }
                                                setSelected(_new);
                                            }}></input> 
                                        </>;
                                    })
                                }
                    </div>
                    );
            })
        }</div></div>
        );
    }

   

    const SendSelected = () => {
        console.log(selected);
        socket.emit("update_item", {updated:selected, key:props.editProduct.key}, (result) => {
            console.log("Result: " + JSON.stringify(result));
        });
    }

    return (
        <React.Fragment>
            <div id='Overlay' className='Overlay'>
                <button className='CloseButton' onClick={(e)=>{props.flipOpen(false); console.log(props); setSelected({});}}>&times;</button>
                <div id='Container' className='Container'>
                    <h1>Edit Modal</h1>
                    <div className='OptionsContainer' style={{overflow:"scroll"}}>
                        {RenderOptions()}
                    </div>
                    <button className='ButtonHoverEffect SubmitButton' onClick={(e)=>{console.log(selected); SendSelected();}}>Submit</button>
                </div>
            </div>
        </React.Fragment>
    );


}


export default EditModal;