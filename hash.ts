//plain password vs hashed (irreversible) password (in database)
import * as bcryptjs from "bcryptjs";

const SALT = 10;

export async function hashPassword(plainPassword:string):Promise<string> {
    const hashPassword:string = await bcryptjs.hash(plainPassword,SALT);
    return hashPassword;
}

export async function checkPassword(plainPassword:string,hashPasswordInDB:string) {
    return await bcryptjs.compare(plainPassword,hashPasswordInDB);
}