import type { Book } from "@/db/schema";
import { HeroBanner } from "@/components/HeroBanner";
import { LibraryClient } from "@/components/LibraryClient";
import { getAllBooks } from "@/lib/queries";

export const metadata = {
    title: "Library",
};

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
    let books: Book[] = [];
    try {
        books = await getAllBooks();
    } catch {
        books = [];
    }

    return (
        <>
            {/* We use the same look and feel but can pass overrides or let it show the library slide by default */}
            <HeroBanner eyebrow="Browse our collection" title="Library" />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
                {books.length === 0 ? (
                    <p className="text-center text-forest/60">
                        No books yet. Add your Supabase connection and run the seed script
                        to get started.
                    </p>
                ) : (
                    <LibraryClient books={books} />
                )}
            </section>
        </>
    );
} 