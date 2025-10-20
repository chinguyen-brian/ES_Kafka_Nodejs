import { drizzle } from "drizzle-orm/node-postgres";
import { DB_URL } from "./src/config/index";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function runMigration() {
  try {
    console.log("Migration start...");
    const pool = new Pool({ connectionString: DB_URL });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("Migration was success");
    pool.end();
  } catch (err) {
    console.log("Migration error", err);
  }
}

runMigration();