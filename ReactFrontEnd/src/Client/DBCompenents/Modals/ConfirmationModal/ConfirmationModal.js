import React from 'react'




import "./ConfirmationModal.css";


export default function ConfirmationModal({...props}){
    return(
        <React.Fragment>
            <div className='Modal'>
                <h4 style={{color:"white", marginLeft:"5%"}}>Would you like to delete:</h4>
                <div className='ButtonContainer'>
                    <button className='CButton ButtonHoverEffect' onClick={(e)=>{props.Data.Func(props.Data.Item); props.Modalwindow({isOpen:false});}}>Yes</button>
                    <button className='CButton ButtonHoverEffect' onClick={(e)=>{props.Modalwindow({isOpen:false});}}>No</button>            
                </div>
                
            </div>

        </React.Fragment>
    );
}