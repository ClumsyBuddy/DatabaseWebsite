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

    const [addResponse, setAddResponse] = useState({success:false, failed:false, duplicate:false});

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
                _new.active = false;
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
        let _new = selected; 
        _new.itemtype = item.ItemType;
        if(_new.itemtype === "Uniform"){
            for(let option of item.Options){
                if(Object.keys(option)[0] !== "Color"){
                    continue;
                }
                _new.Color = option["Color"][0];
            }
        }
        setSelected(_new);
        
    } }>{item.ItemType.replace(/_/g, " ")}</button>);

    const RenderOptions = ItemData.map((item) => 
    {
        if(item.ItemType === ChosenType)
        {
            return (<div className='OList' style={{width:"50vw", height:"50vh", overflow:"scroll"}}>
                <label>{ChosenType.replace(/_/g, " ")}</label>
                <textarea placeholder='Enter SKU' style={{resize:"none"}} cols={20} rows={1} onChange={(e)=>{let _new = selected; _new.sku = e.currentTarget.value; setSelected(_new);}}></textarea>
                <select onChange={(e)=>{let _new = selected; _new.brand = e.currentTarget.value; setSelected(_new);}} style={{transform:"translatey(-5px)"}}>
                    {Brands.map((brand, i) => {return(<option>{brand}</option>)})}
                </select>
                <div style={{width:"100%", height:"auto", display:"flex", flexDirection:"row", justifyContent:"center", flexFlow:"wrap", overflow:"hidden"}}>
                    {
                        item.Options.length !== 0 ? item.Options.map((option) => 
                        {
                            console.log(ChosenType, option);
                            const _Name = Object.keys(option);
                            if(ChosenType === "Uniform" && _Name[0] === "Color")
                            {
                                return (
                                    <div style={{marginTop:"5vh"}}>
                                        <label style={{marginRight:".4vw"}}>Color</label>
                                        <select onChange={(e) => {let _new = selected; _new.Color = e.currentTarget.value; setSelected(_new);}}> 
                                        {
                                            option[_Name[0]].map((o) => {return(<option>{o}</option>)})
                                        }
                                        </select>
                                    </div>
                                );
                            }
                            let optionName = Object.keys(option)[0];
                            return (<>
                                <label>{Object.keys(option)[0].replace(/_/g, " ")}: </label>
                                <div style={{width:"25%", borderStyle:"solid", borderColor:"black", margin:"1%", borderRadius:"10px", padding:"10px", fontSize:"20px"}} className="CheckBoxList">
                                {
                                    option[optionName].map((element, i) => 
                                    {
                                        return ( 
                                            <>
                                            <div>
                                                <label>{element}-</label>
                                                <input type={"checkbox"} className='ItemTypeButton' 
                                                onChange={(e)=> 
                                                    {
                                                        let _new = selected; 
                                                        if(e.currentTarget.checked === false)
                                                        {
                                                            let toReplace = element + ",";
                                                            _new[optionName] = _new[optionName].replace(toReplace, "");
                                                        }else
                                                        {
                                                            if(_new[optionName] === undefined)
                                                            {
                                                                _new[optionName] = element + ",";
                                                            }else
                                                            {
                                                                _new[optionName] += element + ',';
                                                            }
                                                        }
                                                        setSelected(_new);
                                                    }
                                                }>
                                                </input> 
                                            </div>
                                            </>
                                        );
                                    })
                                }
                            </div></>);
                        }) : <div></div>
                    }</div>
                    <label>Active: </label>
                    <input type={"checkbox"} className='ButtonHoverEffect ItemTypeButton' onChange={(e) => {
                        let _new = selected; _new["active"] = e.currentTarget.checked; setSelected(_new);}}>
                    </input> 
            </div>);
        }
        return (<></>);
    });


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
            if(result.status === "success"){
                console.log("Result: " + JSON.stringify(result));                
                setAddResponse({success:true});
            }
            if(result.status === "duplicate"){
                setAddResponse({duplicate:true});
            }
            if(result.status === "failed"){
                setAddResponse({failed:true});
            }


            setTimeout(() => {
                setAddResponse({success:false, failed:false, duplicate:false});
            }, 2000);
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
                    <div>
                        { !addResponse.success ? <></> : 
                        <p style={{margin:"0px", padding:"0px", color:"darkgreen"}}>Item Was Added Successfully!</p> }

                        { !addResponse.failed ? <></> : 
                        <p style={{margin:"0px", padding:"0px", color:"red"}}>Failed To Add Item</p> }
                        
                        { !addResponse.duplicate ? <></> : 
                        <p style={{margin:"0px", padding:"0px", color:"yellow"}}>Item Already Exists</p> }
                    </div>
                </div>
            </div>
        </React.Fragment>
    );


}


export default AddModal;