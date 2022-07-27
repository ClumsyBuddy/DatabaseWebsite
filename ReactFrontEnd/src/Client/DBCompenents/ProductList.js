import React, {useEffect, useRef, useState} from "react";
import { faker } from '@faker-js/faker';
import "./ProdustList.css";
import {Grid} from "react-virtualized"
import 'react-virtualized/styles.css';
import useAuth from "../../hooks/useAuth";



function ProductList(){

    const {auth} = useAuth();

    const ColumnWidth = 250;
    const RowHeight = 200;
    const ColumnMargin = 10;
    const RowMargin = 10;
    const BorderPercent = 0.90;


    const [MaxColumn, setColumn] = useState(Math.floor((window.innerWidth * BorderPercent) / (ColumnWidth+ColumnMargin)));
    const prevWindowWidth = useRef(window.innerWidth);
    const WindowInterval = useRef(true);
    const [GridWidth, setGridWidth] = useState(window.innerWidth * 0.897);



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
    
    const [ProductList, setProductList] = useState([]);

    useEffect(() => {
        const fetchData = () =>{
            fetch("/Test", {
                method:"GET",
                headers: {"Content-Type": "application/JSON"},
              })
              .then(res => {
                return res.json();
              })
              .then(data => {
                return data.ProductList;
              })
                
        }
        fetchData();
    }, []);
    
    const data = new Array(1000).fill().map((value, id) => (({
        id: id,
        title: faker.lorem.words(1),
        body: faker.lorem.words(3)
      })))
      
      const renderRow = ({columnIndex, key, rowIndex, style}) => {
        if(!data[rowIndex*MaxColumn+columnIndex]){
            return (<div></div>);
        }
        return (
        <div style={
            {...style, 
            left:ColumnWidth*columnIndex, 
            top:RowHeight*rowIndex, 
            width:ColumnWidth-(ColumnMargin*2),
            marginLeft:ColumnMargin, 
            marginTop:RowMargin*2,
            marginBottom:RowMargin*2
        }} 
            className="">
            <div key={key} className="Item" style={{height:RowHeight*0.80}}>
                <button>Edit</button>
                <button>Delete</button>
                <p>{rowIndex * MaxColumn + columnIndex}{data[rowIndex*MaxColumn+columnIndex].title}</p>
            </div>
        </div> 
      ); };
      return (
        <div className="ListContainer">
            {   
            data ? 
            
                <Grid style={{display:`flex`, flexDirection:`row`, flexFlow:`wrap`, justifyContent:`center`}}
                cellRenderer={renderRow}
                columnCount={MaxColumn}
                columnWidth={ColumnWidth}
                height={600}
                rowCount={Math.ceil(data.length/MaxColumn)}
                rowHeight={RowHeight}
                width={GridWidth} />
            :
                <div>Loading...</div>
            }
      </div>
      );
   
}


export default ProductList;