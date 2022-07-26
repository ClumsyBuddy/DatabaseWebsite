import React, { useState } from "react";
import { faker } from '@faker-js/faker';
import InfiniteScroll from "react-infinite-scroll-component";
import "./ProdustList.css";



function ProductList(){

    const data = new Array(1000).fill().map((value, id) => (({
        id: id,
        title: faker.lorem.words(1),
        body: faker.lorem.words(4)
      })))
    
      const [count, setCount] = useState({
        prev: 0,
        next: 20
      })
      const [hasMore, setHasMore] = useState(true);
      const [current, setCurrent] = useState(data.slice(count.prev, count.next))
      const getMoreData = () => {
        if (current.length === data.length) {
          setHasMore(false);
          return;
        }
        setTimeout(() => {
          setCurrent(current.concat(data.slice(count.prev + 10, count.next + 10)))
        }, 100)
        setCount((prevState) => ({ prev: prevState.prev + 10, next: prevState.next + 10 }))
      }
    
      return (
        <InfiniteScroll className="ListContainer"
          dataLength={current.length}
          next={getMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          height={600}
        >
          <div className="InnerContainer">
            {current && current.map(((item, index) => (
              <div key={index} className="Item" onClick={(e) => {console.log(e.currentTarget)}}>
                <h3>{`${item.title}-${item.id}`}</h3>
                <p>{item.body}</p>
              </div>
            )))
            }
          </div>
        </InfiniteScroll>
      );
}


export default ProductList;