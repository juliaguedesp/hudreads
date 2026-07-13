import { HeroBanner } from "@/components/HeroBanner";
import { BookshelfExport } from "@/components/BookshelfExport";
import { getAllBooks } from "@/lib/queries";
import type { Book } from "@/db/schema";

export const metadata = {
    title: "Bookshelf",
};

export const dynamic = "force-dynamic";

export default async function BookshelfPage() {
    let books: Book[] = [];
    try {
        books = await getAllBooks();
    } catch {
        books = [];
    }

    return (
        <>
            <HeroBanner eyebrow="Your reading history" title="Bookshelf" />

            {/* 🛠️ ADJUSTED: Relaxed top padding to pt-6 on mobile and sm:pt-10 on desktop for a cleaner look */}
            <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10 sm:pb-14">
                <BookshelfExport allBooks={books} />
            </section>
        </>
    );
}