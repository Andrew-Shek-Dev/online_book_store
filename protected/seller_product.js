//TODO: fetch GET /currentUser
let carts = [];
let data;
const template = document.querySelector("#template");
const action = async(newCart,action_name)=>{
    const num_id = parseInt(newCart.id.replace("id-",""));
    console.log(action_name)
    if (action_name === "update"){
        //Update the Product
        const title = newCart.querySelector(".card-title").value;
        const description = newCart.querySelector(".card-text").value;
        const price = parseInt(newCart.querySelector("[name=price]").value);
        //TODO : Change the form from url-encode to formidable style
        //      because it contain image
        const formData = new FormData();
        formData.append("title",title);
        formData.append("description",description);
        formData.append("price",price);
        const res = await fetch(BACKEND_SERVER_URL+"products/"+num_id,
        {
            method:"PUT",
            body:formData
        });
        await res.json();
    }else{
        //Delete the Product
        const res = await fetch(BACKEND_SERVER_URL+"products/"+num_id,{
            method:"DELETE"
        });
        await res.json();
    }
    await loadCarts();
}

const loadCarts = async ()=>{
    const res = await fetch(BACKEND_SERVER_URL+"carts/1");
    data = await res.json();
    console.log(data);
    carts = [...data.products];
    //Update DOM
    await reloadCarts();
}

const loadProductDetail = async (id)=>{
    const res = await fetch(BACKEND_SERVER_URL+"product/"+id);
    const product = await res.json();
    return product;
}

const reloadCarts = async()=>{
    const cartList = document.querySelector("#cartList");
    cartList.innerHTML = "";
    cartList.appendChild(template);
    for(let cart of carts){
        const product = await loadProductDetail(cart.id);
        const newCart = template.cloneNode(true);
        newCart.id = "id-"+cart.id;
        newCart.style = "border-left: 5px solid wheat;border-radius: 0px 0px 20px 0px;";
        //TODO: update content
        newCart.querySelector("img").src = product.images[0]
        newCart.querySelector(".card-title").value = cart.title;
        newCart.querySelector(".card-text").value =product.description;
        newCart.querySelector("[name=price]").value = cart.price;
        newCart.addEventListener("click",(event)=>{
            if ( event.target.id === "update" ||  event.target.id === "delete"){
                action(newCart, event.target.id)
            }
        });
        cartList.appendChild(newCart);
    }
}

const setupNewProductForm = async()=>{
    document.querySelector("form#newProductForm").addEventListener("submit",async(event)=>{
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        //TODO : test new Product
        const res =  await fetch(BACKEND_SERVER_URL+"products/add",{
            method:"POST",
            body:formData
        });
        const result = await res.json();
        //TODO: handle the result
        closeModal("newProductForm");
        await loadCarts();
    });
}

const main = async ()=>{
    await loadCarts();
    await setupNewProductForm();
}
main();