import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const db_client = new Client({
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD
});
db_client.connect();