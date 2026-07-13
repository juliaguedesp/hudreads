import "./load-env";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("❌ DATABASE_URL is missing.");
  console.error("");
  console.error("Add it to .env.local (not just .env). Example:");
  console.error(
    '  DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"',
  );
  process.exit(1);
}

if (url.includes("[YOUR-PASSWORD]") || url.includes("YOUR_PASSWORD")) {
  console.error("❌ DATABASE_URL still contains a placeholder password.");
  console.error("Replace it with your real Supabase database password.");
  process.exit(1);
}

async function check() {
  console.log("Connecting to database...");
  const sql = postgres(url!, { prepare: false, connect_timeout: 15, max: 1 });

  try {
    const [row] = await sql`select 1 as ok`;
    console.log("✅ Connected successfully.", row);
  } catch (err) {
    console.error("❌ Connection failed:");
    console.error(err instanceof Error ? err.message : err);
    console.error("");
    console.error("Common fixes:");
    console.error("  • Use the Direct connection string (port 5432), not Transaction pooler (6543)");
    console.error("  • Supabase → Project Settings → Database → Connection string → URI → Direct");
    console.error("  • URL-encode special characters in your password (@ → %40, $ → %24, etc.)");
    console.error("  • Put the value in .env.local and restart the terminal");
    process.exit(1);
  } finally {
    await sql.end();
  }
}

check();
