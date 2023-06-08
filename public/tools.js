//const BACKEND_SERVER_URL = "https://dummyjson.com/";
const BACKEND_SERVER_URL = "http://localhost:8080/";

const addToCartFunc = async (id,action)=>{
    let shoppingCart = [];
    //Div (with id)
    if (action === "add"){
        shoppingCart.push({id,quantity:1});
    }else{
        shoppingCart.push({id,quantity:-1});
    }
    const res = await fetch(BACKEND_SERVER_URL+"carts/add",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(shoppingCart)
    });
    const data = await res.json();
    localStorage.setItem("cart",JSON.stringify(data));

    //Update Cart Qty
    const badge = document.querySelector("div#badge");
    //WEF002 Ex
    const qtyTotal = data.products.reduce((total,product)=>product.quantity+total,0);
    badge.innerHTML = qtyTotal;
}
