import React, {useEffect, useRef, useState, useCallback} from "react";
import {Grid} from "react-virtualized"
import 'react-virtualized/styles.css';

import useSocket from "../../hooks/useSocket";

import EditModal from "./Modals/EditModal/EditModal";
import "./DisplayList.css";
import DeleteConfirmationModal from "./Modals/ConfirmationModal/DeleteConfirmationModal";



const ProductList = ({...props}) =>{

    const socket = useSocket();

    const [isConnected, setIsConnected] = useState(socket.connected);

    const ColumnWidth = 250;
    const RowHeight = 200;
    const ColumnMargin = 10;
    const RowMargin = 10;
    const BorderPercent = 0.90;
    const RowItemHeight = 0.80;
    
    const [ProductList, setProductList] = useState([]);
    var DisplayList = [];
    const mounted = useRef(false);
    
    const [MaxColumn, setColumn] = useState(Math.floor((window.innerWidth * BorderPercent) / (ColumnWidth+ColumnMargin)));
    const prevWindowWidth = useRef(window.innerWidth);
    const WindowInterval = useRef(true);
    const [GridWidth, setGridWidth] = useState(window.innerWidth * 0.897); //I found that the width times this value lines scrollbar up with side of container nicely

    const [isOpen, setIsOpen] = useState(false);
    const [editProductSelect, editProductSet] = useState(NaN);

    const [deleteConfirmation, setDeleteConfirmation] = useState({isOpen:false, Item:null, func:undefined});


    const [reRender, setReRender] = useState(false);

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

    const NewItemUpdate = useCallback((item) => {
        for(let i =0; i < ProductList.length; i++){
            if(ProductList[i].key === item.key){
                console.log(ProductList, item);
                ProductList[i] = item;
                setProductList(ProductList);
            }
        }
    }, [ProductList]);

    const DeleteItem = useCallback((key, socketResonse=false) => {
        const RemoveAtIndex = (index) =>{
            const deleteItem = ()=>{
                const newArray = [...ProductList];
                newArray.splice(index, 1);
                setProductList(newArray);
            }
            if(!socketResonse){
                socket.emit("delete_item_server", {key}, (response)=>{
                    if(response.status === "ok"){
                        deleteItem();
                    }else{
                        console.log("Socket Failed to recieve response");
                    }
                });
            }
            if(socketResonse){
                deleteItem();
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
        //eslint-disable-next-line
    }, [ProductList]);



    const AddItem = useCallback((item) => {
        console.log("Add Item");
        ProductList.push(item);
        setProductList(ProductList);
        setReRender(!reRender);
    }, [ProductList, reRender]);
    
    if(!mounted.current){ //All pre render task go here
        fetchData();
    }
    //Search function, gets search query and returns displaylist with results based on query
    if(props.Query){
        DisplayList = [];
        let _Query = props.Query.replace(new RegExp("/", "g"), " ").replace(new RegExp(",", "g"), " ").split((' '));
        _Query = _Query.filter(item => item);
        let QueryLength = _Query.length;
        
        ProductList.forEach((p, i) => {
            let Match = 0;
            
            _Query.forEach((q, __i) =>{
                
                let Not_Check = false;
                let Was_Not = false;
                for(var property in p){
                    if(p[property] === null || p[property] === undefined){
                        continue;
                    }
                    let Prop = p[property].toString().toLowerCase();
                    let _q = q.toLowerCase();

                    if(_q[0] === "!"){
                        let newQ = _q.replace(/!/g, "");
                        Not_Check = true;
                        if(Prop.includes(newQ)){
                            Was_Not = true;
                        }
                    }
                    if(_q[0] === "|" && _q[_q.length-1] === "|"){
                        const newQ = _q.replace(/\|/g, "");
                        if(Prop === newQ){
                            Match++;
                            break;
                        }
                    }
                    if(_q[0] !== "!" || _q[0] !== "|"){
                        if(Prop.includes(_q)){
                            console.log("Generic Include");
                            Match++;
                            break;
                        }
                    }
                    
                }
                if(!Was_Not && Not_Check){
                    Match++;
                }
            });
            if(Match >= QueryLength){
                DisplayList.push(ProductList[i]);
            }
       });
    }else{
        DisplayList = ProductList;
    }


    const AnyFilters = () => {
        let HaveFilter = false;
        for(const key in props.Filter){
            if(props.Filter[key] !== ""){
                HaveFilter = true;
            }
        }
        return HaveFilter;
    }

    if(AnyFilters()){
        let newDisplayList = [];
        let filteredObj = Object.fromEntries(
            Object.entries(props.Filter).filter(([key, value]) => value !== "")
        );
        let Length = Object.keys(filteredObj).length; //Get the amount of Filter things we are going to need to check for
        let filterNames = Object.keys(filteredObj); // The actual items we need to check for

        DisplayList.forEach((ele) => { //Loop the objects and check for matches
            let Matches = 0;
            let pItem = Object.keys(ele); // ===> Could use for in instead of getting keys most likely
            filterNames.forEach((fEle)=>{
                pItem.forEach((i) => {
                    if(ele[i] === props.Filter[fEle]){
                        Matches++;
                    }
                })
            })
            // if(ele.brand === props.Filter.Brand){
            //     Matches++;
            // }
            // if(ele.itemtype === props.Filter.Type){
            //     Matches++;
            // }
            if(Matches >= Length){ //If we have the correct number of matches on this item then append it to the new list
                newDisplayList.push(ele);
            }
        })
        DisplayList = newDisplayList;
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
        socket.on("delete_item_client", (msg)=>{DeleteItem(Number(msg.key), true);});
        socket.on("new_Item_Added", (item) => {AddItem(item)})
        socket.on("client_updated_item", (updatedItem) =>{ NewItemUpdate(updatedItem);})

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("delete_item_client");
            socket.off("new_Item_Added");
            socket.off("client_updated_item");
        }
        //eslint-disable-next-line
    }, [DeleteItem, AddItem, NewItemUpdate]);

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
    }}  className="">
        <div className="Item" style={{height:RowHeight*RowItemHeight}}>
            <div className="InfoContainer">
                <p className="InfoDisplay DSKU">SKU: {DisplayList[rowIndex*MaxColumn+columnIndex].sku}</p>
                <hr style={{fontSize:"1px", width:"50px"}}></hr>
                <p className="InfoDisplay DBRAND">BRAND: {DisplayList[rowIndex*MaxColumn+columnIndex].brand}</p>
                <hr style={{fontSize:"1px", width:"50px"}}></hr>
                <p className="InfoDisplay DTYPE">Type: {DisplayList[rowIndex*MaxColumn+columnIndex].itemtype.replace(/_/g, " ")}</p>
            </div>
            <div className="EditAddContainer">
                <button onClick={(e)=>{flipOpen(true); editProductSet(DisplayList[rowIndex*MaxColumn+columnIndex]);}} className="EditButton ButtonHoverEffect">Edit</button>
                <button value={DisplayList[rowIndex*MaxColumn+columnIndex].key} onClick={(e)=>{setDeleteConfirmation({isOpen:true, Item:e.currentTarget.value, func:DeleteItem});}} className="DeleteButton ButtonHoverEffect">Delete</button>
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
             {isOpen ? <EditModal flipOpen={flipOpen} editProduct={editProductSelect} /> : <></>}
             {deleteConfirmation.isOpen ? <DeleteConfirmationModal Modalwindow={setDeleteConfirmation} Data={{Item:deleteConfirmation.Item, Func:deleteConfirmation.func}}  /> : <></>}
      </div>
      );
   
}


export default ProductList;