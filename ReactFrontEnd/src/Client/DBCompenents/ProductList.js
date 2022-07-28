import React, {useEffect, useRef, useState} from "react";
import "./ProdustList.css";
import {Grid} from "react-virtualized"
import 'react-virtualized/styles.css';



function ProductList(){

    const ColumnWidth = 250;
    const RowHeight = 200;
    const ColumnMargin = 10;
    const RowMargin = 10;
    const BorderPercent = 0.90;
    
    const [ProductList, setProductList] = useState([]);
    const mounted = useRef(false);


    const [MaxColumn, setColumn] = useState(Math.floor((window.innerWidth * BorderPercent) / (ColumnWidth+ColumnMargin)));
    const prevWindowWidth = useRef(window.innerWidth);
    const WindowInterval = useRef(true);
    const [GridWidth, setGridWidth] = useState(window.innerWidth * 0.897);

    const fetchData = () =>{
        fetch("/Test", {
            method:"GET",
            headers: {"Content-Type": "application/JSON"},
          })
          .then(res => {
            return res.json();
          })
          .then(data => {
            console.log("Set ProductList");
            setProductList(data);
          })
    }


    useEffect(() => {      
        if(WindowInterval.current){
            window.addEventListener('resize', () => {
                setGridWidth(window.innerWidth * 0.897);
                if(window.innerWidth === prevWindowWidth.current){
                    return;
                }
                setColumn(Math.floor((window.innerWidth * BorderPercent) / (ColumnWidth+ColumnMargin)));
                prevWindowWidth.current = window.innerWidth;
            });
            WindowInterval.current = false;
        }
    }, [MaxColumn, prevWindowWidth, WindowInterval]);
    
    

    if(!mounted.current){ //All pre render task go here
        fetchData();
    }

    useEffect(() => {
        mounted.current = true;
    }, []);

    
    const renderRow = ({columnIndex, key, rowIndex, style}) => {
    if(!ProductList[rowIndex*MaxColumn+columnIndex]){
        return (<div></div>);
    }
    return (
    <div key={key} style={
        {...style, 
        left:ColumnWidth*columnIndex, 
        top:RowHeight*rowIndex, 
        width:ColumnWidth-(ColumnMargin*2),
        marginLeft:ColumnMargin, 
        marginTop:RowMargin*2,
        marginBottom:RowMargin*2
    }} 
        className="">
        <div className="Item" style={{height:RowHeight*0.80}}>
            <button>Edit</button>
            <button value={ProductList[rowIndex*MaxColumn+columnIndex].key} onClick={(e)=>{console.log(e.currentTarget.value)}}>Delete</button>
            <p>{ProductList[rowIndex*MaxColumn+columnIndex].sku}<br></br>{ProductList[rowIndex*MaxColumn+columnIndex].brand}</p>
        </div>
    </div> 
    ); };

      return (
        <div className="ListContainer">
            {   
            ProductList.length !== 0 ? 
            
                <Grid style={{display:`flex`, flexDirection:`row`, flexFlow:`wrap`, justifyContent:`center`}}
                cellRenderer={renderRow}
                columnCount={MaxColumn}
                columnWidth={ColumnWidth}
                height={600}
                rowCount={Math.ceil(ProductList.length/MaxColumn)}
                rowHeight={RowHeight}
                width={GridWidth} />
            :
                <div>Loading...</div>
            }
      </div>
      );
   
}


export default ProductList;