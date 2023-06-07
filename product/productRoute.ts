import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./productHandler";

export const productRouter = Router();

productRouter.get("/products",getAllProducts);
productRouter.get("/product/:id",getProductById);
productRouter.post("/products/add",addProduct);
productRouter.put("/products/:id",updateProduct);
productRouter.delete("/products/:id",deleteProduct);