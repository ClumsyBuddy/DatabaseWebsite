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
            const keys = Object.keys(props.editProduct);
            var _new = {};
            for(let i = 0; i < keys.length; i++){ //This sets the selected options on startup.
                if(props.editProduct[keys[i]] === null || keys[i] === "sku" || keys[i] === 'brand' || 
                    keys[i] === "key" || typeof props.editProduct[keys[i]] !== "string" || keys[i] === "itemtype"){
                    continue;
                }
                _new[keys[i]] = props.editProduct[keys[i]] + ",";
            }
            if(_new){
                setSelected(_new);                
            }
        }
        mounted.current = true;
    }, [props.editProduct]);

    /*
    *   This function checks if the item shoud be checked on startup based off a few patterns
    */
    const SetChecked = (optionName, _element) => {
        const Products = props.editProduct;
        const element = _element.toString();
        if(Products[optionName] === null || Products[optionName] === "0"){ //If its null or 0 then return false (Aka not checked)
            return false;
        }

        if(typeof Products[optionName] === "string" && Products[optionName].includes(",") && Products[optionName].split(",").length > 1){ //if its a string with multiple options
            for(let i = 0; i < Products[optionName].split(",").length; i++){
                if(Products[optionName].split(",")[i] === element){
                    return true;
                }
            }
        }
        if( //If its true or just plain equal return true
            Products[optionName] === true || Products[optionName] === "true" || 
            Products[optionName].toString() === "1" || Products[optionName] === element
        ){
            return true;
        }

        return false; //All other cases return false
    }

    const RenderOptions = () => {
        return (
            <div className='OList' style={{width:"50vw", height:"55vh", overflow:"scroll"}}>
            <label>
                ItemType: {props.editProduct.itemtype}
            </label>
            <label style={{margin:"20px"}}>SKU: {props.editProduct.sku.replace(/_/g, " ")}</label>
            <label>Brand: {props.editProduct.brand} </label>
            <label> Color: {props.editProduct.Color}</label>
            <div style={{width:"100%", height:"auto", display:"flex", 
                flexDirection:"row", justifyContent:"center", flexFlow:"wrap", overflow:"hidden"}}>
            {
                !ItemData.length ? <div style={{color:"white"}}>Loading...</div> :
                ItemData.map((option) => 
                {
                    let optionName = Object.keys(option)[0];

                    if(optionName === "Color"){
                        return <></>;
                    }
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
                                                console.log(element, _new);
                                                if(e.currentTarget.checked === false){
                                                    let toReplace = element;
                                                    _new[optionName] = _new[optionName].replace(toReplace + ",", "");
                                                    
                                                }else{
                                                    if(_new[optionName] === undefined){
                                                        _new[optionName] = element + ",";
                                                    }else{
                                                        _new[optionName] += element + ',';
                                                    }
                                                }
                                                setSelected(_new);
                                            }
                                            }></input> 
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
        socket.emit("update_item", {updated:selected, key:props.editProduct.key}, (result) => {
            console.log("Result: " + JSON.stringify(result));
        });
        props.flipOpen(false);
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