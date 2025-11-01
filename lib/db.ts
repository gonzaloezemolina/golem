import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

export default sql;