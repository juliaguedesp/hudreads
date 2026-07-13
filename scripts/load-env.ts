import { config } from "dotenv";
import { resolve } from "path";

// Next.js reads .env.local; CLI scripts must load it explicitly.
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });
