import React, {createContext, useEffect, useRef, useState} from "react";
import "./DisplayList.css";
import {Grid} from "react-virtualized"
import 'react-virtualized/styles.css';
import EditModal from "./EditModal/EditModal";


const ProductList = ({...props}) =>{

    const ColumnWidth = 250;
    const RowHeight = 200;
    const ColumnMargin = 10;
    const RowMargin = 10;
    const BorderPercent = 0.90;
    
    const [ProductList, setProductList] = useState([]);
    var DisplayList = [];
    const mounted = useRef(false);
    
    const [MaxColumn, setColumn] = useState(Math.floor((window.innerWidth * BorderPercent) / (ColumnWidth+ColumnMargin)));
    const prevWindowWidth = useRef(window.innerWidth);
    const WindowInterval = useRef(true);
    const [GridWidth, setGridWidth] = useState(window.innerWidth * 0.897);

    const [isOpen, setIsOpen] = useState(false);

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

    const DeleteItem = (key) => {
        const RemoveAtIndex = (index) =>{
            const newArray = [...ProductList];
            newArray.splice(index, 1);
            setProductList(newArray);
        }
        ProductList.forEach(
            (product, index) => {
                if(product.key ===  Number(key)){
                    console.log("Delete Key");
                    RemoveAtIndex(index);
                }
            } 
        )
    }


    if(!mounted.current){ //All pre render task go here
        fetchData();
        
    }

    if(props.Query){
        DisplayList = [];
        let _Query = props.Query.replace("+", " ").replace(",", " ").split((' '));
        _Query = _Query.filter(item => item);
        let QueryLength = _Query.length;
        ProductList.forEach((p, i) => {
            let Match = 0;
            _Query.forEach((q, __i) =>{
                for(var property in p){
                    if(p[property] === null || p[property] === undefined){
                        continue;
                    }
                    let Prop = p[property].toString().toLowerCase();
                    if(Prop.includes(q.toLowerCase())){
                        Match++;
                    }
                }
            });
            if(Match === QueryLength){
                DisplayList.push(ProductList[i]);
            }
       });
    }else{
        DisplayList = ProductList;
    }

    const flipOpen = (bool) =>{
        setIsOpen(bool);
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

    useEffect(() => {
        mounted.current = true;
    }, []);

    const renderRow = ({columnIndex, key, rowIndex, style}) => {
    if(!DisplayList[rowIndex*MaxColumn+columnIndex]){
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
            <button onClick={(e)=>{flipOpen(true); console.log("isOpen: " + isOpen)}}>Edit</button>
            <button value={DisplayList[rowIndex*MaxColumn+columnIndex].key} onClick={(e)=>{DeleteItem(e.currentTarget.value);}}>Delete</button>
            <p>{DisplayList[rowIndex*MaxColumn+columnIndex].sku}<br></br>{DisplayList[rowIndex*MaxColumn+columnIndex].brand}</p>
        </div>
    </div> 
    ); };

      return (
        <div className="ListContainer">
            {   
            DisplayList.length !== 0 ? 
            
                <Grid style={{display:`flex`, flexDirection:`row`, flexFlow:`wrap`, justifyContent:`center`}}
                cellRenderer={renderRow}
                columnCount={MaxColumn}
                columnWidth={ColumnWidth}
                height={600}
                rowCount={Math.ceil(DisplayList.length/MaxColumn)}
                rowHeight={RowHeight}
                width={GridWidth} />
            :
                <div style={{color:"white", textAlign:"center"}}>Loading...</div>
            }
             {isOpen ? <EditModal flipOpen={flipOpen} isOpen={isOpen} /> : <></>}
      </div>
      );
   
}


export default ProductList;