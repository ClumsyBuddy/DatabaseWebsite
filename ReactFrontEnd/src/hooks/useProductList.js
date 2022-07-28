import { useContext } from "react";
import ProductList from "../Client/context/ProductList";

const useProductList = () => {
    return useContext(ProductList);
}

export default useProductList;