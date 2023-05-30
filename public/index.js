async function loadBooks(){
    //Ask for server - fetch
    const res = await fetch("https://dummyjson.com/products");
    //Extract JSON
    const books = await res.json();
    //Update DOM
    const template = document.querySelector("#template");
    const bookList = document.querySelector("#booklist");
    for(let book of books.products){
        const newBook = template.cloneNode(true);
        newBook.style="";
        newBook.querySelector("img").src = book.images[0];
        newBook.querySelector(".card-title").innerHTML = book.title;
        newBook.querySelector(".card-text").innerHTML = `HKD$${book.price}`;
        bookList.appendChild(newBook);
    }
}

const main = async ()=>{
    await loadBooks();
}
main();