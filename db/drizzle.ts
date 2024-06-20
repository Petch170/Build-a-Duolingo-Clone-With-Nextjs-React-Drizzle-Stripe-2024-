import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(process.env.DATABASE_URL!); // บอกtypescriptว่า ตัวแปรจะไม่เป็นค่า null  หรือ  undefinded
const db = drizzle(sql, { schema });

export default db;
