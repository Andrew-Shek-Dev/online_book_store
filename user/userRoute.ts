import { Router } from "express";
import {login,logout,currentUser,register} from './UserHandler';

export const userRouter = Router();
userRouter.post("/auth/login",login);
userRouter.post("/logout",logout);
userRouter.get("/currentUser",currentUser);
userRouter.post("/users/add",register);