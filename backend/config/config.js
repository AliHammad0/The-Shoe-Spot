import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

export const PORT = process.env.PORT || 8080;
export const MONGO = process.env.MONGO;
export const SECRET_KEY = process.env.SECRET_KEY;
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;