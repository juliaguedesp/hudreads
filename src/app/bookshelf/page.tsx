import { Suspense } from "react";
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
            <HeroBanner title="Bookshelf" />

            <section className="mx-auto max-w-6xl px-4 pt-3 pb-10 sm:px-6 sm:pt-3 sm:pb-14">
                <Suspense fallback={<div className="text-center py-12 text-forest/50">Loading bookshelf...</div>}>
                    <BookshelfExport allBooks={JSON.parse(JSON.stringify(books))} />
                </Suspense>
            </section>
        </>
    );
}