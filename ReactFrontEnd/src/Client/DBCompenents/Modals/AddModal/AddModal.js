import React, { useEffect, useRef, useState } from 'react';

import "../Modal.css";
import "./AddModal.css";



const AddModal = ({...props}) => {

    const [ItemData, setItemData] = useState([]);
    const [ChosenType, setChosenType] = useState("");

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
            return item.Options.length !== 0 ? item.Options.map((option) => <button className='ButtonHoverEffect ItemTypeButton'>{Object.keys(option)[0].replace(/_/g, " ")}</button>) : <p>Item Has No Options</p>;
        }
        return (<></>);
    })


    const ReturnRender = () =>{
        if(!ChosenType){
            if(RenderType.length === 0){
                return(<div>Loading...</div>);
            }
            return(RenderType);
        }else{
            if(RenderOptions.length === 0){
                return(<div>Loading...</div>);
            }
            return(RenderOptions);
        }
    }

    return (
        <React.Fragment>
            <div id='Overlay' className='Overlay'>
                <button className='CloseButton' onClick={(e)=>{props.setIsOpen(false)}}>&times;</button>
                <div id='Container' className='Container'>
                    <h1>Add Modal</h1>
                    <div className='OptionsContainer'>
                        {ReturnRender()}
                    </div>
                    <button className='ButtonHoverEffect SubmitButton'>Submit</button>
                </div>
            </div>
        </React.Fragment>
    );


}



export default AddModal;