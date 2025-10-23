import dotenv from "dotenv";
dotenv.config();

export const DB_URL = process.env.DATABASE_URL;
export const APP_PORT = process.env.APP_PORT;
export const CATALOG_BASE_URL = process.env.CATALOG_BASE_URL;
export const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL;
