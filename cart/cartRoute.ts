import { Router } from "express";
import { addProductInCart, payment, getCart } from "./cartHandler";
export const cartRouter = Router();

cartRouter.post("/carts/add",addProductInCart);
cartRouter.post("/carts/payment",payment);
cartRouter.get("/carts/:id",getCart);