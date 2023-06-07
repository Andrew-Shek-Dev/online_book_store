import express from "express";
import path from "path";
import {userRouter} from "./user/userRoute";
import {productRouter} from "./product/productRoute";
import { cartRouter } from "./cart/cartRoute";
import { applyExpressSessionMiddleware } from "./session";
import { loginGuardForPage } from "./guard";

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(applyExpressSessionMiddleware);

app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);

app.use(express.static(path.resolve(__dirname,"public")));
app.use(loginGuardForPage,express.static(path.resolve(__dirname,"protected")));
app.listen(process.env.PORT,()=>{
    console.log("Online Book Store Server is started");
});