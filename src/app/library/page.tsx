import type { Book } from "@/db/schema";
import { LibraryClient } from "@/components/LibraryClient";
import { getAllBooks } from "@/lib/queries";

export const metadata = { title: "Library" };
export const dynamic = "force-dynamic";

export default async function LibraryPage() {
    let books: Book[] = [];
    try { books = await getAllBooks(); } catch { books = []; }

    return (
        <div>
            <section className="mx-auto max-w-6xl w-full px-4 pt-6 sm:px-6 sm:pt-8 pb-[-100px]">
                {books.length === 0 ? (
                    <p className="text-center text-forest/60">No books yet.</p>
                ) : (
                    <LibraryClient books={books} />
                )}
            </section>
        </div>
    );
}