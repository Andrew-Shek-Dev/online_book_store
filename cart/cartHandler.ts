import { Request,Response } from "express";
import { CartItem } from "./types";
import { db_client } from "../database";
import {SQL_GET_A_PRODUCT} from "../product/productHandler";

const SQL_INSERT_CART = (cart_id:number,member_id:number,product_id:number,quantity:number)=>`insert into cart (cart_id,member_id,product_id,payment,quantity) values (${cart_id},${member_id},${product_id},true,${quantity}) returning *`;
const SQL_SELECT_SELLER_PRODUCT = (member_id:number)=>`select * from product where owner_id=${member_id}`;

export const addProductInCart =async (req:Request,res:Response) => {
    const newItems:Array<Pick<CartItem,"id"|"quantity">> = req.body;
    if (!req.session.cart){
        const products = [];
        let total = 0;
        for(let newItem of newItems){
            const productRec = await db_client.query(SQL_GET_A_PRODUCT(newItem.id.toString()));
            products.push({
                id:newItem.id,
                title:productRec.rows[0].title,
                price:productRec.rows[0].price,
                quantity:newItem.quantity,
                total: productRec.rows[0].price * newItem.quantity
            });
            total += productRec.rows[0].price * newItem.quantity;
        }
        const count = await db_client.query(`SELECT * from cart WHERE member_id= ${req.session.user?.user_id}`);
        const id =parseInt(req.session.user?.user_id.toString()+ count.rowCount.toString());
        req.session.cart = {id,products,total}
    }else{
        const products = [];
        let total = 0;
        for(let newItem of newItems){
            const productRec = await db_client.query(SQL_GET_A_PRODUCT(newItem.id.toString()));
            const check = req.session.cart.products.filter(product=>product.id === newItem.id);
            if (check.length == 0){
                products.push({
                    id:newItem.id,
                    title:productRec.rows[0].title,
                    price:productRec.rows[0].price,
                    quantity:newItem.quantity,
                    total: productRec.rows[0].price * newItem.quantity
                });
                total += productRec.rows[0].price * newItem.quantity;
            }else{
                check[0].quantity = newItem.quantity + check[0].quantity;
                check[0].total = check[0].price * newItem.quantity + check[0].total;
                total +=check[0].price * newItem.quantity;
            }
        }
        req.session.cart = {
            id:req.session.cart.id,
            products:[...req.session.cart.products,...products],
            total: req.session.cart.total + total
        }
    }
    res.json({
        cart_id:req.session.cart?.id,
        products:req.session.cart?.products
    });
}
export const payment =async (req:Request,res:Response) => {
    const cart_id = req.session.cart?.id;
    const member_id = req.session.user?.user_id;
    const products =req.session.cart?.products as CartItem[];
    let count = 0;
    for(let product of products){
        const checkRec = await db_client.query(SQL_INSERT_CART(cart_id as number,member_id as number,product.id,product.quantity));
        if (checkRec.rows.length > 0){
            count++;
        }
    }
    if (count === products.length){
        res.json({success:true,invoice:cart_id});
    }else{
        res.json({success:false, msg: "unknown error"});
        //TODO: clear all of related inserted record
    }
}
export const getCart =async (req:Request,res:Response) => {
    if(req.session.user?.role === "buyer"){
        const {id} = req.params;
        if (id === req.session.cart?.id.toString()){
            res.json({
                cart_id:req.session.cart?.id,
                products:req.session.cart?.products
            });
        }else{
            res.json({success:false,msg:"Please contact admin"});
        }
    }else if (req.session.user?.role === "seller"){
        const productRec = await db_client.query(SQL_SELECT_SELLER_PRODUCT(req.session.user.user_id));
        res.json({
            products:productRec.rows
        })
    }else{
        res.json({msg:"You an admin!"})
    }
}