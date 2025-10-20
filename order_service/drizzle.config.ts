import { defineConfig } from "drizzle-kit";
import { DB_URL } from "./src/config";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dbCredentials: {
    url: DB_URL!,
  },
  verbose: true,
  strict: true,
});
