import expressSession from "express-session";
import { Member } from "./user/types";
export const applyExpressSessionMiddleware = expressSession({
    secret:process.env.SESSION_SECRET as string,
    saveUninitialized:true,
    resave:true,
});

export type SessionUser = Pick<Member,"user_id"|"username"|"role"|"cart_id">;

declare module "express-session"{
    interface SessionData{
        user:SessionUser
    }
}