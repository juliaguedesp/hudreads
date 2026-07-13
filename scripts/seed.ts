import "./load-env";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { bookOfMonth, books } from "../src/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

if (
  connectionString.includes("[YOUR-PASSWORD]") ||
  connectionString.includes("YOUR_PASSWORD")
) {
  throw new Error(
    "DATABASE_URL still has a placeholder password. Update .env.local with your real Supabase password.",
  );
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

const sampleBooks = [
  {
    slug: "the-secret-history",
    title: "The Secret History",
    author: "Donna Tartt",
    genre: "Literary Fiction",
    publishedYear: 1992,
    pageCount: 559,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1451554027i/29044.jpg",
    synopsis:
      "Under the influence of their charismatic classics professor, a group of clever eccentrics at a New England college discover a way of thinking and living that is a world away from the humdrum existence of their contemporaries.",
    hudsonReference:
      "Recommended during a live Q&A when asked about his favorite campus-set novels. Hudson mentioned this as one of the books that made him fall in love with dark academia vibes.",
  },
  {
    slug: "normal-people",
    title: "Normal People",
    author: "Sally Rooney",
    genre: "Literary Fiction",
    publishedYear: 2018,
    pageCount: 273,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1571423190i/41057294.jpg",
    synopsis:
      "Connell and Marianne grow up in the same small town, but the differences between them keep them apart — until a life-changing connection binds them to one another.",
    hudsonReference:
      "Shared on social media as a book that stayed with him long after finishing. Hudson praised the emotional honesty of Connell and Marianne's relationship.",
  },
  {
    slug: "project-hail-mary",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Science Fiction",
    publishedYear: 2021,
    pageCount: 496,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
    synopsis:
      "Ryland Grace is the sole survivor on a desperate, last-chance mission — and if he fails, humanity and the Earth itself will perish.",
    hudsonReference:
      "Recommended for anyone who wants a hopeful, clever space adventure. Hudson called Rocky 'the best friendship in recent sci-fi.'",
  },
  {
    slug: "tomorrow-and-tomorrow-and-tomorrow",
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    genre: "Literary Fiction",
    publishedYear: 2022,
    pageCount: 416,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1636978607i/58784475.jpg",
    synopsis:
      "On a bitter-cold day, Sam Masur exits a subway car and sees, amid the hordes of people waiting on the platform, Sadie Green. He calls her name. For a moment, she pretends she hasn't heard him.",
    hudsonReference:
      "Highlighted in an interview about books that explore friendship and art. Hudson said the creative partnership at the heart of the book reminded him of collaboration on set.",
  },
];

async function seed() {
  console.log("Seeding database...");

  for (const book of sampleBooks) {
    await db.insert(books).values(book).onConflictDoNothing({ target: books.slug });
  }

  const [featured] = await db
    .select()
    .from(books)
    .where(eq(books.slug, "the-secret-history"))
    .limit(1);

  if (featured) {
    const now = new Date();
    await db.insert(bookOfMonth).values({
      bookId: featured.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      discordLink: "https://discord.gg/your-bookclub-invite",
      blurb:
        "Join the hudreads book club as we dive into this dark academia classic together.",
      isActive: true,
    });
  }

  console.log("Seed complete.");
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
