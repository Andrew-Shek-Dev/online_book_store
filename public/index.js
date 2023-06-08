let user = undefined;
const addToCart = async (event)=>{
    const id = parseInt( event.currentTarget/*element which defined event function*/.id.replace("id-",'') );
    addToCartFunc(id,"add");
}

async function loadBooks(){
    //Ask for server - fetch
    const res = await fetch(BACKEND_SERVER_URL+"products");
    //Extract JSON
    const books = await res.json();
    //Update DOM
    const template = document.querySelector("#template");
    const bookList = document.querySelector("#booklist");
    for(let book of books){
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
        if (!user.message){
            closeModal();
        }else{
            document.querySelector("div#loginError").innerHTML = `<div class='error'>${user.message}<div>`;
        }
        await getCurrentUser();
    })
}

async function logoutFormSetup(){
    document.querySelector("button#logout").addEventListener("click",async(event)=>{
        const res = await fetch(BACKEND_SERVER_URL+"logout",{
            method:"POST"
        });
        const {success} = await res.json();
        if (success){
            window.location = "/";
        }
        await getCurrentUser();
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

        const newForm = {
            username: form.username.value,
            password: form.password.value,
            role: buyer?"buyer":"seller"
        }
        const res = await fetch(BACKEND_SERVER_URL + "users/add", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newForm)
        });
        const user = await res.json();
        form.reset();
        closeModal();
    });
    setupToast();
}

const main = async ()=>{
    await loadBooks();
    await loginFormSetup();
    await logoutFormSetup();
    await registerFormSetup();
}
main();