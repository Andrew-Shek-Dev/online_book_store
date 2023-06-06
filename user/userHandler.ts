import { Request,Response } from "express";
import {db_client} from "../database";
import { Member } from "./types";

//SQL Zone
const SQL_CHECK_USER_EXIST = (username:string)=>{
    return `SELECT * FROM members WHERE username = '${username}'`;
}
const SQL_INSERT_MEMBER =async(member:Member)=>{
    const roleData = await db_client.query(`SELECT id from role where name = '${member.role}'`);
    return `INSERT INTO members (username,password,role) values ('${member.username}','${member.password}',${roleData.rows[0].id}) RETURNING *`
}

//Function Definition Zone
export const login = async (req:Request,res:Response) => {
    //Step 1 : Check user exist
    //Step 2a : non-exist, res.json
    //Step 2b : exist, check password
    //Step 3 : session
    //Step 4 : res.json({success:true})
}

export const logout = async (req:Request,res:Response) => {
    
}

export const currentUser = async (req:Request,res:Response) => {
    
}

export const register = async (req:Request,res:Response) => {
    const {username,password,role} = req.body;
    //TODO: backend validations
    //Step 1 : Check username is existed?
    const checkUser = await db_client.query(SQL_CHECK_USER_EXIST(username));
    //Step 2a : If exist, res.json({success:false}), then return;
    if (checkUser.rows.length > 0){
        res.json({success:false,msg:"User has registered already"});
        return;
    }
    //Step 2b : If non-exists, INSERT INTO sql
    const insertUser = await db_client.query(await SQL_INSERT_MEMBER({username,password,role}));

    //Step 3 : res.json({success:true})
    if (insertUser.rows.length > 0){
        res.json({success:true});
    }else{
        res.json({success:false,msg:"known error"});
    }
}