import React, {useEffect, useRef, useState, useCallback} from "react";
import {Grid} from "react-virtualized"
import 'react-virtualized/styles.css';

import {io} from "socket.io-client";

import EditModal from "./Modals/EditModal/EditModal";
import "./DisplayList.css";


const socket = io("http://192.168.1.123:8000/");

const ProductList = ({...props}) =>{

    const [isConnected, setIsConnected] = useState(socket.connected);

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
        fetch("/ProductList", {
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

    const DeleteItem = useCallback((key, socketResonse=false) => {
        const RemoveAtIndex = (index) =>{
            if(!socketResonse){
                socket.emit("delete_item_server", {key}, (response)=>{
                    if(response.status === "ok"){
                        const newArray = [...ProductList];
                        newArray.splice(index, 1);
                        setProductList(newArray);
                    }else{
                        console.log("Socket Failed to recieve response");
                    }
                });
            }
        }
        ProductList.forEach(
            (product, index) => {
                if(product.key ===  Number(key)){
                    console.log("Delete Key");
                    RemoveAtIndex(index);
                }
            } 
        )
    }, [ProductList]);

    
    if(!mounted.current){ //All pre render task go here
        fetchData();
    }
    //Search function, gets search query and returns displaylist with results based on query
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

    const flipOpen = (bool) =>{ //Function To slip SetIsOpen. Used to send to children components
        setIsOpen(bool);
    }
    //Setups window resize listener to resize columns on window resize
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
    

    //Mounts and setups sockets
    useEffect(() => {
        mounted.current = true; //Sets Mount to True after first run
        socket.on("connect", () => {setIsConnected(true)});
        socket.on("disconnect", () => {setIsConnected(false)});
        socket.on("delete_item_client", (msg)=>{DeleteItem(msg.key, true);});

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("delete_item_client");
        }
    }, [DeleteItem]);

    const renderRow = ({columnIndex, key, rowIndex, style}) => {
    //If we have no valid Items in DisplayList Array then return empty element
    if(!DisplayList[rowIndex*MaxColumn+columnIndex]){
        return (<></>);
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
            <div className="EditAddContainer">
                <button onClick={(e)=>{flipOpen(true); console.log("isOpen: " + isOpen)}} className="EditButton ButtonHoverEffect">Edit</button>
                <button value={DisplayList[rowIndex*MaxColumn+columnIndex].key} onClick={(e)=>{DeleteItem(e.currentTarget.value);}} className="DeleteButton ButtonHoverEffect">Delete</button>
            </div>
            <div className="InfoContainer">
                <p className="InfoDisplay">SKU: {DisplayList[rowIndex*MaxColumn+columnIndex].sku}</p>
                <p className="InfoDisplay">BRAND: {DisplayList[rowIndex*MaxColumn+columnIndex].brand}</p>
            </div>
        </div>
    </div> 
    ); };

      return (
        <div className="ListContainer">
            {   
            DisplayList.length !== 0 || !isConnected ? 
            
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
             {isOpen ? <EditModal flipOpen={flipOpen} /> : <></>}
      </div>
      );
   
}


export default ProductList;