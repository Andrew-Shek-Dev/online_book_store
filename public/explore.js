let user = undefined;
let shoppingCart = {
    userId:-1,
    products:[]
}
const addToCart = async (event)=>{
    //Div (with id)
    const id = parseInt( event.currentTarget/*element which defined event function*/.id.replace("id-",'') );
    shoppingCart.userId = user.id;
    const checkQty = shoppingCart.products.filter(cart=>cart.id == id);
    if (checkQty.length == 0){
        shoppingCart.products.push({id,quantity:1})
    }else{
        checkQty[0].quantity++;
    }
    const res = await fetch(BACKEND_SERVER_URL+"carts/add",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(shoppingCart)
    });
    const data = await res.json();
    /*
    {
    "id": 21,
    "products": [
        {
            "id": 1,
            "title": "iPhone 9",
            "price": 549,
            "quantity": 1,
            "total": 549,
            "discountPercentage": 12.96,
            "discountedPrice": 478
        }
    ],
    "total": 549,
    "discountedTotal": 478,
    "userId": 15,
    "totalProducts": 1,
    "totalQuantity": 1
    }
    */
    localStorage.setItem("cart",JSON.stringify(data));
}

async function loadBooks(){
    //Ask for server - fetch
    const res = await fetch(BACKEND_SERVER_URL+"products");
    //Extract JSON
    const books = await res.json();
    //Update DOM
    const template = document.querySelector("#template");
    const bookList = document.querySelector("#booklist");
    for(let book of books.products){
        const newBook = template.cloneNode(true);
        newBook.id = "id-"+book.id;
        newBook.style="";
        newBook.querySelector("img").src = book.images[0];
        newBook.querySelector(".card-title").innerHTML = book.title;
        newBook.querySelector(".card-text").innerHTML = `HKD$${book.price}`;

        newBook.addEventListener("click",addToCart);

        bookList.appendChild(newBook);
    }
}

async function loginFormSetup(){
    document.querySelector("form#loginPanel").addEventListener("submit",async (event)=>{
        event.preventDefault();
        const form = event.target;
        const res = await fetch(BACKEND_SERVER_URL+"auth/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username: form.username.value /*'kminchelle'*/,
                password: form.password.value/*'0lelplR'*/,
            })
        });
        user = await res.json();
        console.log(user)
        if (!user.message){
            const loginButton = document.querySelector("button#loginButton");
            const userInfo = document.querySelector("div#logginPanel");
            loginButton.setAttribute("hidden",undefined);
            userInfo.removeAttribute("hidden");
            const span = userInfo.querySelector("span");
            span.innerText = user.username; let myModalEl = document.getElementById('exampleModal');
            let modal = bootstrap.Modal.getInstance(myModalEl)
            modal.hide();
        }else{
            document.querySelector("div#loginError").innerHTML = `<div class='error'>${user.message}<div>`;
        }
        
    })
}

async function logoutFormSetup(){
    document.querySelector("button#logout").addEventListener("click",async(event)=>{
        //TODO: fetch POST /logout
        const loginButton = document.querySelector("button#loginButton");
        const userInfo = document.querySelector("div#logginPanel");
        userInfo.setAttribute("hidden",undefined);
        loginButton.removeAttribute("hidden");
        user = undefined;
    });
}

async function registerFormSetup() {
    document.querySelector("form#RegisterPanel").addEventListener("submit", async (event) => {
        event.preventDefault();

        const form = event.target;
        if (form.password.value != form.confirmPassword.value) {
            const errTag = document.querySelector("#errTag");
            errTag.innerHTML = "<div class='error'>Both passwords not matched</div>";
            return;
        }
        errTag.innerHTML = "";
        const buyer = document.querySelector("#flexRadioDefault1").checked;
        //const seller = document.querySelector("#flexRadioDefault2").checked;
        const newForm = {
            username: form.username.value,
            password: form.password.value,
            role: buyer?"buyer":"seller"
        }
        console.log(newForm)
        const res = await fetch(BACKEND_SERVER_URL + "users/add", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newForm)
        });
        const user = await res.json();
        let myModalEl = document.getElementById('exampleModal');
        let modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
    });

    const toastTrigger = document.getElementById('liveToastBtn')
    const toastLiveExample = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastTrigger.addEventListener('click', () => {
            toastBootstrap.show()
        })
    }
}

const main = async ()=>{
    await loadBooks();
    await loginFormSetup();
    await logoutFormSetup();
    await registerFormSetup();
}
main();