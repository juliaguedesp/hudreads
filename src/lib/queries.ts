import { eq, ilike, or, sql, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { books, bookOfMonth, reviews } from "@/db/schema";

export async function getAllBooks() {
    return getDb().select().from(books).orderBy(books.title);
}

export async function getBookBySlug(slug: string) {
    const [book] = await getDb()
        .select()
        .from(books)
        .where(eq(books.slug, slug))
        .limit(1);
    return book ?? null;
}

export async function searchBooks(query: string) {
    const pattern = `%${query}%`;
    return getDb()
        .select()
        .from(books)
        .where(
            or(
                ilike(books.title, pattern),
                ilike(books.author, pattern),
                ilike(books.genre, pattern),
            ),
        )
        .orderBy(books.title);
}

export async function getBookCount() {
    const [result] = await getDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(books);
    return result?.count ?? 0;
}

export async function getReviewsForBook(bookId: string) {
    return getDb()
        .select()
        .from(reviews)
        .where(eq(reviews.bookId, bookId))
        .orderBy(desc(reviews.createdAt));
}

// drizzle query running over the "botm" table mapper
export async function getActiveBookOfMonth() {
    const [row] = await getDb()
        .select({
            bookOfMonth: bookOfMonth,
            book: books,
        })
        .from(bookOfMonth)
        .innerJoin(books, eq(bookOfMonth.bookId, books.id))
        .where(eq(bookOfMonth.isActive, true))
        .orderBy(desc(bookOfMonth.year), desc(bookOfMonth.month))
        .limit(1);

    return row ?? null;
}

// fetches all previous month picks (where isActive is false), sorted newest to oldest
export async function getPastBooksOfMonth() {
    const rows = await getDb()
        .select({
            bookOfMonth: bookOfMonth,
            book: books,
        })
        .from(bookOfMonth)
        .innerJoin(books, eq(bookOfMonth.bookId, books.id))
        .where(eq(bookOfMonth.isActive, false))
        .orderBy(desc(bookOfMonth.year), desc(bookOfMonth.month));

    return rows;
}