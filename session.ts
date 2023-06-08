import expressSession from "express-session";
import { Member } from "./user/types";
import { Cart } from "./cart/types";
export const applyExpressSessionMiddleware = expressSession({
    secret:process.env.SESSION_SECRET as string,
    saveUninitialized:true,
    resave:true,
});

export type SessionUser = Pick<Member,"user_id"|"username"|"role">;

declare module "express-session"{
    interface SessionData{
        user?:SessionUser,
        cart?:Cart
    }
}