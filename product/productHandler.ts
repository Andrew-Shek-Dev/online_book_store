import { Request,Response } from "express";
import { db_client } from "../database";
import formidable from "formidable";
import {mkdirSync} from "fs";
import path from "path";
import { Product } from "./types";

export const UPLOAD_PRODUCT_DIR = path.resolve(__dirname,"uploads");
mkdirSync(UPLOAD_PRODUCT_DIR,{recursive:true});

export const SQL_GET_ALL_PRODUCT = `select * from product order by id desc`;
export const SQL_GET_A_PRODUCT = (product_id:string)=>`select * from product where id=${product_id}`;
export const SQL_ADD_PRODUCT = (product:Partial<Product>)=>{
    const keys = Object.keys(product);//["title", "description", "price", "image"] =join=> title, description, price, image
    const values = Object.values(product).map((value:any)=>{
        if(isNaN(value)){
            return `'${value}'`;
        }else{
            return value;
        }
    })
    console.log(`insert into product (${keys.join(",")}) values (${values.join(",")}) returning *`);
    return `insert into product (${keys.join(",")}) values (${values.join(",")}) returning *`;
}
export const SQL_UPDATE_PRODUCT = (product:Partial<Product>)=>{
    const keys = Object.keys(product);
    const values = Object.values(product);
    const updateValues = keys.map((key,idx)=>{
        if (isNaN(values[idx] as any)){
            return `${key}='${values[idx]}'`
        }else{
            return `${key}=${values[idx]}`
        }
    });
    return `update product set ${updateValues.join(",")} where id = ${product.id} returning *`;
}
export const SQL_DELETE_PRODUCT = (id:string)=>`delete from product where id=${id}`;

const newProductForm = formidable({
    uploadDir:UPLOAD_PRODUCT_DIR,
    maxFiles:1,
    maxFileSize:1000*1024*1024,
    keepExtensions:true,
    filter:part=>part.mimetype?.startsWith("image/") || false
});

const updateProductForm = formidable({
    uploadDir:UPLOAD_PRODUCT_DIR,
    maxFiles:1,
    maxFileSize:1000*1024*1024,
    keepExtensions:true,
    filter:part=>part.mimetype?.startsWith("image/") || false
});

export const getAllProducts =async (req:Request,res:Response) => {
    const {rows} = await db_client.query(SQL_GET_ALL_PRODUCT);
    //res.json(rows);
    const products = rows.map(row=>({...row,images:[row.image]}));
    res.json(products);
}
export const getProductById =async (req:Request,res:Response) => {
    const {id /*string*/} = req.params;
    //parseInt(id) //string -> int
    const {rows} = await db_client.query(SQL_GET_A_PRODUCT(id));
    //res.json(rows[0]);
    res.json(
        {
            ...rows[0],
            images:[rows[0].image]
        }
    );
}
export const addProduct =async (req:Request,res:Response) => {
    newProductForm.parse(req,async(err,fields,files)=>{
        if (err){
            res.json({success:false,msg:err});
            return;
        }
        const {title,description,price} = fields;
        const {image} = files;
        let newProduct:Partial<Product>;
        if (image){
            newProduct = {
                title:title as string,
                description: description as string,
                price: parseInt(price as string),
                image: (image as formidable.File).newFilename
            }
        }else{
            newProduct = {
                title:title as string,
                description: description as string,
                price: parseInt(price as string)
            }
        }
        const insertProductRec = await db_client.query(SQL_ADD_PRODUCT(newProduct));
        if (insertProductRec.rows.length > 0 ){
            res.json({success:true});
        }else{
            res.json({success:false,msg:"unknown error"});
        }
    });
}
export const updateProduct = async (req:Request,res:Response) => {
    const {id} = req.params;
    updateProductForm.parse(req,async(err,fields,files)=>{
        try{
            if (err){
                console.log(err);
                res.json({success:false,msg:err});
                return;
            }
            const {title,description,price} = fields;            
            const {image} = files;
            let newProduct:Partial<Product>;
            if (image){
                newProduct = {
                    id:parseInt(id),
                    title:title as string,
                    description: description as string,
                    price: parseInt(price as string),
                    image: (image as formidable.File).newFilename
                }
            }else{
                newProduct = {
                    id:parseInt(id),
                    title:title as string,
                    description: description as string,
                    price: parseInt(price as string)
                }
    
            }
            const updateRec = await db_client.query(SQL_UPDATE_PRODUCT(newProduct));
            if (updateRec.rows.length > 0){
                res.json({success:true});
            }else{
                res.json({success:false,msg:"unknown error"});
            }
        }catch(err){
            console.log(err);
            res.json({success:false,msg:"unknown error"});
        }
    });
}
export const deleteProduct =async (req:Request,res:Response) => {
    const {id} = req.params;
    const before = await db_client.query(SQL_GET_ALL_PRODUCT);
    await db_client.query(SQL_DELETE_PRODUCT(id));
    const after = await db_client.query(SQL_GET_ALL_PRODUCT);
    res.json({success:before.rows.length > after.rows.length});
}