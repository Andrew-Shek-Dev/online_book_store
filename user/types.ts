export type Member = {
    user_id?:number,
    username:string,
    password:string,
    role: "buyer"|"seller"|"admin",
    profile_url?:string
}