import dotenv from "dotenv";
dotenv.config();

export const APP_PORT = process.env.APP_PORT;
export const ORDER_BASE_URL = process.env.ORDER_BASE_URL;
export const AUTH_SERVICE_BASE_URL = process.env.AUTH_SERVICE_BASE_URL;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLISH_KEY = process.env.STRIPE_PUBLISH_KEY;
