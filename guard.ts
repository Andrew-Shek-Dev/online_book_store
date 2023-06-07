import { Request,Response,NextFunction } from "express";
import "./session";

export const loginGuardForPage = async(req:Request,res:Response,next:NextFunction)=>{
    if (req.session.user){
        next();
    }else{
        res.redirect("/");
    }
}

export const loginGuardForAPI = async(req:Request,res:Response,next:NextFunction)=>{
    if (req.session.user){
        next();
    }else{
        res.json({success:false,msg:"Please login first!"});
    }
}