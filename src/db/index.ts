import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // Ensure this relative path matches your folder hierarchy!

// Prevent duplicate connections in development mode
const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set inside your environment configuration.");
}

// Reuse the existing connection pool if available, otherwise initialize a new client pool
const client = globalForDb.conn ?? postgres(connectionString, {
    prepare: false,
    max: 10, // Prevents a single Next.js container instance from hoarding pool capacity
    onnotice: () => { }, // Bypasses notice routing issues over transaction poolers
    publications: "all" // Forces connection parameter alignment across serverless pipelines
});

if (process.env.NODE_ENV !== "production") {
    globalForDb.conn = client;
}

export const db = drizzle(client, { schema });

// Keep your helper getter function active so existing application imports don't break
export function getDb() {
    return db;
}