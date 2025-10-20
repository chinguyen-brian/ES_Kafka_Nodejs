import * as schema from "./schema";
import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { DB_URL } from "../config";

const pool = new Pool({
  connectionString: DB_URL,
});

export const DB: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
