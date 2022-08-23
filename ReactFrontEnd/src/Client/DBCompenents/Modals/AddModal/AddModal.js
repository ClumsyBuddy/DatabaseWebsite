import React, { useEffect, useRef, useState } from 'react';
import useSocket from "../../../../hooks/useSocket";

import "../Modal.css";
import "./AddModal.css";

const AddModal = ({...props}) => {

    const socket = useSocket();


    const [ItemData, setItemData] = useState([]);
    const [ChosenType, setChosenType] = useState("");
    const [Brands, setBrands] = useState([]);
    const [selected, setSelected] = useState({});

    const mounted = useRef(false);

    useEffect(()=>{
        const FetchItemData = () => {
            fetch("/ItemData", {
                method:"GET",
                headers: {"Content-Type": "application/JSON"},
              })
              .then(res => {
                return res.json();
              })
              .then(data => {
                setItemData(data.ItemData);
                setBrands(data.Brand);
                let _new = selected;
                _new.brand = data.Brand[0];
                setSelected(_new);
            });
        }
        socket.on("AddConfigUpdated", response => {
            console.log(response.NewData);
            setItemData(response.NewData);
        });
        if(!mounted.current){
            FetchItemData();
            
        }
        mounted.current = true;

        return () => {
            socket.off("AddConfigUpdated")
        }


    }, [selected, socket]);

    //TODO Should Probably break up this unreadable blob of code. This does way to much
    // I should also initialize all of the Options and  values to false on startup.
    const RenderType = ItemData.map((item) => <button className='ButtonHoverEffect ItemTypeButton' onClick={(e)=>{setChosenType(item.ItemType);
        let _new = selected; _new.itemtype = item.ItemType; setSelected(_new);
    } }>{item.ItemType.replace(/_/g, " ")}</button>);          
    const RenderOptions = ItemData.map((item) => {
        if(item.ItemType === ChosenType){
            return (<div className='OList' style={{width:"50vw", height:"55vh", overflow:"scroll"}}>
                <label>{ChosenType.replace(/_/g, " ")}</label>
                <textarea placeholder='Enter SKU' style={{resize:"none"}} cols={20} rows={1} onChange={(e)=>{let _new = selected; _new.sku = e.currentTarget.value; setSelected(_new);}}></textarea>
                <select onChange={(e)=>{let _new = selected; _new.brand = e.currentTarget.value; setSelected(_new);}}>
                    {Brands.map((brand, i) => {return(<option>{brand}</option>)})}
                </select>
                <div style={{width:"100%", height:"auto", display:"flex", 
                    flexDirection:"row", justifyContent:"center", 
                    flexFlow:"wrap", overflow:"hidden"}}>
                    {
                        item.Options.length !== 0 ? item.Options.map((option) => {
                        let optionName = Object.keys(option)[0];
                        return (<div style={{width:"20%", borderStyle:"solid", borderColor:"black", margin:"1%", borderRadius:"10px", padding:"10px", 
                            display:"block", fontSize:"20px"}}>
                        <label>{Object.keys(option)[0].replace(/_/g, " ")}: </label>
                        {
                            option[optionName].map((element, i) => {
                                if(element === "" || element === true || element === false){
                                    return (<> {element === "" ? <label style={{textDecoration:"underline"}}>textbox</label> : <></>}
                                    <input type={"checkbox"} className='ButtonHoverEffect ItemTypeButton' onChange={(e) => {let _new = selected; _new[optionName] = e.currentTarget.checked; setSelected(_new); console.log(selected); }}></input> </>
                                    );
                                }
                                return ( <>
                                    <label>{element}</label>
                                    <input type={"checkbox"} className='ButtonHoverEffect ItemTypeButton' onChange={(e)=>{
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
                                </>);
                            })
                        }
                    </div>);
                }) : <p>Item Has No Options</p> 
            }</div></div>);
        }
        return (<></>);
    })


    const ReturnRender = () =>{
        if(!ChosenType){
            return(RenderType.length === 0 ? <div>Loading...</div> : RenderType);
        }else{
            return(RenderOptions.length === 0 ? <div>Loading...</div> : RenderOptions);
        }
    }

    const SendSelected = () => {
        if(!selected.brand || !selected.sku){
            console.log("Missing SKU or Brand");
            return false;
        }
        socket.emit("add_Item", selected, (result) => {
            console.log("Result: " + JSON.stringify(result));
            //Need to show something that lets user know its been updated with the item
        });
    }

    return (
        <React.Fragment>
            <div id='Overlay' className='Overlay'>
                <button className='CloseButton' onClick={(e)=>{props.setIsOpen(false); setSelected({});}}>&times;</button>
                <div id='Container' className='Container'>
                    <h1>Add Modal</h1>
                    <div className='OptionsContainer' style={{overflow:"scroll"}}>
                        {ReturnRender()}
                    </div>
                    {!ChosenType ? <></> : <button className='ButtonHoverEffect SubmitButton' onClick={(e)=>{SendSelected()}}>Submit</button>}
                </div>
            </div>
        </React.Fragment>
    );


}


export default AddModal;