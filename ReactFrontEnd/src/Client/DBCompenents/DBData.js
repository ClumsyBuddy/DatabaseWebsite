import useProductList from "../../hooks/useProductList";





export function GetAllProducts(){
    const {ProductList} = useProductList();
    console.log(ProductList);
    fetch("/Test", {
        method:"GET",
        headers: {"Content-Type": "application/JSON"},
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log("Set ProductList");
        ProductList({List:data});
    })
}