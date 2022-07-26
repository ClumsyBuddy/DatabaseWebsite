import React, {useState} from "react";
import { faker } from '@faker-js/faker';
import "./ProdustList.css";
import {Grid} from "react-virtualized"

function ProductList(){
    const MaxColumn = 5;

    const data = new Array(1000).fill().map((value, id) => (({
        id: id,
        title: faker.lorem.words(1),
        body: faker.lorem.words(3)
      })))
      
      const renderRow = ({columnIndex, key, rowIndex, style}) => (
        <div style={{...style, marginLeft:`10px`, marginRight:`10px`}} className="InnerContainer">
            <div key={key} className="Item">
                <p>{rowIndex * MaxColumn + columnIndex}</p>
            </div>
        </div>
      );
      return (
        <div className="ListContainer">
            <Grid style={{display:`flex`, justifyContent:`center`}}
            cellRenderer={renderRow}
            columnCount={MaxColumn}
            columnWidth={300}
            height={600}
            rowCount={data.length}
            rowHeight={300}
            width={1500}
        />
      </div>
      );
   
}


export default ProductList;