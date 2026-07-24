"use client";

import { useMemo, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { SearchBar } from "@/components/SearchBar";
import type { Book } from "@/db/schema";

export function LibraryClient({ books }: { books: Book[] }) {
    const [query, setQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    // Safely extract and flatten genres regardless of database format (string, array, or null)
    const genres = useMemo(() => {
        const allGenres: string[] = [];
        books.forEach((b) => {
            if (Array.isArray(b.genre)) {
                allGenres.push(...b.genre);
            } else if (typeof b.genre === "string" && b.genre) {
                allGenres.push(b.genre);
            }
        });
        return Array.from(new Set(allGenres)).sort();
    }, [books]);

    // Filter books by text query AND selected genre safely
    const filtered = useMemo(() => {
        return books.filter((b) => {
            const matchesQuery =
                !query.trim() ||
                b.title.toLowerCase().includes(query.toLowerCase()) ||
                b.author.toLowerCase().includes(query.toLowerCase());

            let matchesGenre = true;
            if (selectedGenre) {
                if (Array.isArray(b.genre)) {
                    matchesGenre = b.genre.includes(selectedGenre);
                } else {
                    matchesGenre = b.genre === selectedGenre;
                }
            }

            return matchesQuery && matchesGenre;
        });
    }, [books, query, selectedGenre]);

    return (
        <div className="pb-12 sm:pb-16">
            <SearchBar
                value={query}
                onChange={setQuery}
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
            />
            <p className="mt-4 text-xs text-forest/60">
                {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
                {filtered.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}