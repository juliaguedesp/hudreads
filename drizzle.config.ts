import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env.local first, fall back to .env if needed
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

if (!process.env.DIRECT_DATABASE_URL) {
    throw new Error("DIRECT_DATABASE_URL is missing in environment variables.");
}

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DIRECT_DATABASE_URL,
    },
});