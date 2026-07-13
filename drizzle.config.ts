import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Explicitly load the local overrides file before compiling the config object
dotenv.config({ path: ".env.local" });

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DIRECT_DATABASE_URL!,
    },
});