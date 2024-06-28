import "dotenv/config";
import * as schema from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Reseting the database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challengesOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubsciption);

    console.log("Resetting  finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};
main();
