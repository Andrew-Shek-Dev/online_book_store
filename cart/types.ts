export type CartItem = {
    id:number,
    title:string,
    price:number,
    quantity:number,
    total:number
}

export type Cart={
    id:number,
    products:Array<CartItem>,
    total:number
}