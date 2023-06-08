//TODO: fetch GET /currentUser
let carts = [];
let data;
const template = document.querySelector("#template");
const action = async(id,action)=>{
    const num_id = parseInt(id.replace("id-",""));
    const targetCart=carts.filter(cart=>cart.id==num_id)[0];
    if (action === "add"){
        targetCart.quantity = targetCart.quantity + 1;
        targetCart.total = targetCart.price * targetCart.quantity;
        data.total = data.total + targetCart.price;
         //Update to Server
        addToCartFunc(num_id,action);
    }else{
        if (targetCart.quantity >= 1){
            targetCart.quantity = targetCart.quantity - 1;
            targetCart.total = targetCart.price * targetCart.quantity;
            data.total = data.total - targetCart.price;
             //Update to Server
            addToCartFunc(num_id,action);
        }
    }
    await reloadCarts();
}

const loadCarts = async ()=>{
    data = JSON.parse(window.localStorage.getItem("cart"));
    console.log(data);
    carts = [...data.products];
    //Update DOM
    await reloadCarts();
}

const reloadCarts = async()=>{
    const cartList = document.querySelector("#cartList");
    cartList.innerHTML = "";
    cartList.appendChild(template);
    for(let cart of carts){
        const newCart = template.cloneNode(true);
        newCart.id = "id-"+cart.id;
        newCart.style = "border-left: 5px solid wheat;border-radius: 0px 0px 20px 0px;";
        //TODO: update content
        newCart.querySelector(".card-title").innerText = cart.title;
        newCart.querySelector(".card-text").innerText = `@HKD$${cart.price}`;
        newCart.querySelector("input#quantity").value = cart.quantity;
        newCart.querySelector("div.card-footer > small").innerText = `HKD $${cart.total}`
        newCart.addEventListener("click",(event)=>{
            const button = event.target.id;
            const id = event.currentTarget.id;
            action(id,button)
        });
        cartList.appendChild(newCart);
    }
    document.querySelector("div#total").innerText = `HKD $${data.total}`
}

const handlePayment = async()=>{
    document.querySelector("#liveToastBtn").addEventListener("click", async() => {
        const res = await fetch(BACKEND_SERVER_URL+"carts/payment",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({cart_id:data.cart_id})
        });
        const {success,invoice} = await res.json();
        if (success) {
            document.querySelector(".toast-body").innerHTML = `Payment Completed! Invoice# : ${invoice}`;
        } else {
            document.querySelector(".toast-body").innerHTML = `Payment fail!`;
        }
        localStorage.removeItem("cart");
        await getCurrentUser();
    });
    setupToast();
}

const main = async ()=>{
    await loadCarts();
    await handlePayment();
}
main();