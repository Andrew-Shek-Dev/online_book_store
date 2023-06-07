import { Request,Response } from "express";
import {db_client} from "../database"; //<-load dotenv
import { Member } from "./types";
import "../session";
import { checkPassword, hashPassword } from "../hash";
//=> copy
/*
declare module "express-session"{
    interface SessionData{
        user:SessionUser
    }
}*/

//SQL Zone
const SQL_CHECK_USER_EXIST = (username:string)=>{
    return `SELECT * FROM members WHERE username = '${username}'`;
}
const SQL_INSERT_MEMBER =async(member:Partial<Member>)=>{
    const roleData = await db_client.query(`SELECT id from role where name = '${member.role}'`);
    return `INSERT INTO members (username,password,role) values ('${member.username}','${member.password}',${roleData.rows[0].id}) RETURNING *`
}
const SQL_GET_ROLE = (role_id:number)=>`SELECT name from role WHERE id=${role_id}`;

//Function Definition Zone
export const login = async (req:Request,res:Response) => {
    //Step 1 : Check user exist
    const {username, /*plain*/password} = req.body;
    const checkUserRec = await db_client.query(SQL_CHECK_USER_EXIST(username));
    //Step 2a : non-exist, res.json
    if (checkUserRec.rows.length == 0){
        res.json({success:false,msg:"Wrong Username/Password!"})
        return;
    }
    //Step 2b : exist, check password
    let matched = await checkPassword(password,checkUserRec.rows[0].password);
    if (!matched){
        res.json({success:false,msg:"Wrong Username/Password!"})
        return;
    }
    //Step 3 : session
    const user = checkUserRec.rows[0];
    const roleRec = await db_client.query(SQL_GET_ROLE(user.role));
    const sessionUser = {
        user_id:user.user_id,
        username:user.username,
        role:roleRec.rows[0].name,
    };
    req.session.user = sessionUser;
    //Step 4 : res.json({success:true})
    return res.json(sessionUser);
}

export const logout = async (req:Request,res:Response) => {
    req.session.destroy(()=>{
        res.json({success:true});
    });
}

export const currentUser = async (req:Request,res:Response) => {
    res.json(req.session.user?req.session.user:{success:false,msg:"Please login first"});
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
    const hashedPassword = await hashPassword(password);
    const insertUser = await db_client.query(await SQL_INSERT_MEMBER({username,password:hashedPassword,role}));

    //Step 3 : res.json({success:true})
    if (insertUser.rows.length > 0){
        res.json({success:true});
    }else{
        res.json({success:false,msg:"known error"});
    }
}