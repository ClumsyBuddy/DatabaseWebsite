import React, { useEffect, useRef, useState } from 'react';

import "../Modal.css";
import "./AddModal.css";



const AddModal = ({...props}) => {

    const [ItemData, setItemData] = useState([]);
    const [ChosenType, setChosenType] = useState("");

    const [selected, setSelected] = useState([]);

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
                setItemData(data);
              });
        }
        if(!mounted.current){
            FetchItemData();
        }
        mounted.current = true;
    }, []);

    
    const RenderType = ItemData.map((item) => <button className='ButtonHoverEffect ItemTypeButton' onClick={(e)=>{setChosenType(item.ItemType);}}>{item.ItemType.replace(/_/g, " ")}</button>);          
    const RenderOptions = ItemData.map((item) => {
        if(item.ItemType === ChosenType){
            console.log(item.Options);
            return (<div className='OList' style={{width:"50vw", height:"55vh", overflow:"scroll"}}>
                <label>{ChosenType.replace(/_/g, " ")}</label>
                <textarea placeholder='Enter SKU' style={{resize:"none"}} cols={20} rows={1}></textarea>
                <select>
                    <option>Hello</option>
                    <option>Hello1</option>
                </select>
                <div style={{width:"100%", height:"auto", display:"flex", 
                            flexDirection:"row", justifyContent:"center", 
                            flexFlow:"wrap", overflow:"hidden"}}>{
                item.Options.length !== 0 ? item.Options.map((option) => {
                    let optionName = Object.keys(option)[0];
                    return (<div style={{width:"20%", borderStyle:"solid", borderColor:"black", margin:"1%", borderRadius:"10px", padding:"10px", 
                                        display:"block", fontSize:"20px"}}>
                        <label>{Object.keys(option)[0].replace(/_/g, " ")}: </label>
                        {
                            option[optionName].map((element, i) => {
                                console.log(element)
                                if(element === ""){
                                    return (<> <label style={{textDecoration:"underline"}}>textbox</label> <input type={"checkbox"} className='ButtonHoverEffect ItemTypeButton'></input> </>);
                                }
                                if(element === true || element === false){
                                    return (
                                    <>
                                        <br/>
                                        <label>{"True"}</label>
                                        <input type={"radio"} radioGroup={optionName} name={optionName} value={true} className='ButtonHoverEffect ItemTypeButton'></input>
                                        <label>{"False"}</label>
                                        <input type={"radio"} radioGroup={optionName} name={optionName} value={false} className='ButtonHoverEffect ItemTypeButton'></input>
                                    </>
                                    );
                                }
                                return ( <>
                                    <label>{element}</label>
                                    <input type={"checkbox"} className='ButtonHoverEffect ItemTypeButton'></input> 
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

    return (
        <React.Fragment>
            <div id='Overlay' className='Overlay'>
                <button className='CloseButton' onClick={(e)=>{props.setIsOpen(false)}}>&times;</button>
                <div id='Container' className='Container'>
                    <h1>Add Modal</h1>
                    <div className='OptionsContainer' style={{overflow:"scroll"}}>
                        {ReturnRender()}
                    </div>
                    <button className='ButtonHoverEffect SubmitButton'>Submit</button>
                </div>
            </div>
        </React.Fragment>
    );


}





const OptionDisplay = (...props) => {


    return(
        <>

        
        
        
        
        
        </>
    );
}






export default AddModal;