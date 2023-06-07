import express from "express";
import path from "path";
import {userRouter} from "./user/userRoute";
import { applyExpressSessionMiddleware } from "./session";

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(applyExpressSessionMiddleware);

app.use(userRouter);

app.use(express.static(path.resolve(__dirname,"public")));
app.use(/*TODO: guard,*/express.static(path.resolve(__dirname,"protected")));
app.listen(process.env.PORT,()=>{
    console.log("Online Book Store Server is started");
});