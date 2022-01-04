import { config } from "dotenv";

config();

export const PORT = process.env.PORT;
export const DB_CONNECTION = process.env.DB_CONNECTION;
export const DB_NAME = process.env.DB_NAME;
export const SESSION_SECRET = process.env.SESSION_SECRET;
