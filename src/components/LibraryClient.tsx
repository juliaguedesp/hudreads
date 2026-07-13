"use client";

import { useMemo, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { SearchBar } from "@/components/SearchBar";
import type { Book } from "@/db/schema";

type Props = {
    books: Book[];
};

export function LibraryClient({ books }: Props) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return books;

        return books.filter((book) => {
            // 🛠️ FIX APPLIED: Cast to unknown/string[] to satisfy the strict TypeScript compiler
            const matchesGenre = Array.isArray(book.genre)
                ? (book.genre as string[]).some((g) => g?.toLowerCase().includes(q))
                : typeof book.genre === "string"
                    ? (book.genre as string).toLowerCase().includes(q)
                    : false;

            return (
                book.title.toLowerCase().includes(q) ||
                book.author.toLowerCase().includes(q) ||
                matchesGenre
            );
        });
    }, [books, query]);

    return (
        <div>
            <SearchBar value={query} onChange={setQuery} />
            <p className="mt-4 text-sm text-forest/60">
                {filtered.length} book{filtered.length !== 1 ? "s" : ""}
                {query && ` matching "${query}"`}
            </p>
            {filtered.length === 0 ? (
                <p className="mt-12 text-center text-forest/60">No books found.</p>
            ) : (
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
                    {filtered.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}