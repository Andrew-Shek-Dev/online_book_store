//TODO: fetch GET /currentUser

const loadCarts = async ()=>{
    const res = await fetch(BACKEND_SERVER_URL+"carts/1");
    const carts = await res.json();
    
    //Update DOM
    const template = document.querySelector("#template");
    const cartList = document.querySelector("#cartList");
    for(let cart of carts.products){
        const newCart = template.cloneNode(true);
        newCart.style = "border-left: 5px solid wheat;border-radius: 0px 0px 20px 0px;";
        //TODO: update content
        newCart.querySelector(".card-title").innerText = cart.title;
        newCart.querySelector(".card-text").innerText = `@HKD$${cart.price}`;
        newCart.querySelector("input#quantity").value = cart.quantity;
        newCart.querySelector("div.card-footer > small").innerText = `HKD $${cart.total}`
        cartList.appendChild(newCart);
    }
    document.querySelector("div#total").innerText = `HKD $${carts.total}`
}

const main = async ()=>{
    await loadCarts();
}
main();