import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const app = express();

app.use(express.static(path.resolve(__dirname,"public")));
app.use(/*TODO: guard,*/express.static(path.resolve(__dirname,"protected")));
app.listen(process.env.PORT,()=>{
    console.log("Online Book Store Server is started");
});