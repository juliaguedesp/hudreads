"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Save, BookCheck, CirclePercent } from "lucide-react";
import type { Book } from "@/db/schema";
import { getReadBookSlugs } from "@/lib/utils";
import { Button } from "./Button";
import { BookCard } from "@/components/BookCard";

type Props = {
    allBooks: Book[];
};

export function BookshelfExport({ allBooks }: Props) {
    const [readSlugs, setReadSlugs] = useState<string[] | null>(null);
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        queueMicrotask(() => {
            setReadSlugs(getReadBookSlugs() || []);
        });
    }, []);

    if (readSlugs === null) return null;

    const readBooks = allBooks.filter((b) => readSlugs.includes(b.slug));

    // 📊 Stats Calculations
    const totalPagesRead = readBooks.reduce((sum, book) => sum + (Number(book.pageCount) || 0), 0);

    const libraryPercentage = allBooks.length > 0
        ? Math.round((readBooks.length / allBooks.length) * 100)
        : 0;

    async function handleDownload() {
        if (!exportRef.current) return;
        const canvas = await html2canvas(exportRef.current, {
            backgroundColor: "#F5F0E8",
            scale: 2,
        });
        const link = document.createElement("a");
        link.download = "my-hudreads-bookshelf.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    if (readBooks.length === 0) {
        return (
            <div className="flex flex-col items-center py-16 text-center">
                <BookshelfIcon />
                <h2 className="mt-6 font-display text-2xl font-bold text-forest">
                    Your shelf is empty
                </h2>
                <p className="mt-3 max-w-md text-forest/60">
                    Mark books as &ldquo;Read&rdquo; on any book page and they&apos;ll appear
                    here. Your list is saved to this device.
                </p>
                <Button href="/library" className="mt-8">
                    Browse the library
                </Button>
            </div>
        );
    }

    return (
        <div>
            {/* 📈 Stats Display Grid */}
            <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4">

                {/* Total Pages Card */}
                <div className="flex flex-col items-center justify-center text-center rounded-xl border border-forest/10 bg-beige-dark p-4 sm:p-6 shadow-sm space-y-1.5 sm:space-y-2">
                    <div className="rounded-xl sm:rounded-2xl bg-tan/70 p-2 sm:p-3 text-forest/70">
                        <BookCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <p className="text-s sm:text-sm font-medium text-forest/60">Total Pages Read</p>
                        <p className="font-display text-xl sm:text-2xl font-bold text-forest mt-0.5">
                            {totalPagesRead.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Library Completed Card */}
                <div className="flex flex-col items-center justify-center text-center rounded-xl border border-forest/10 bg-beige-dark p-4 sm:p-6 shadow-sm space-y-1.5 sm:space-y-2">
                    <div className="rounded-xl sm:rounded-2xl bg-tan/70 p-2 sm:p-3 text-forest/70 ">
                        <CirclePercent className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <p className="text-s sm:text-sm font-medium text-forest/60">Library Completed</p>
                        <p className="font-display text-xl sm:text-2xl font-bold text-forest mt-0.5">
                            {libraryPercentage}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Header bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <Button onClick={handleDownload} icon={Save}>
                    Download bookshelf image
                </Button>
            </div>

            {/* Display Shelf Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {readBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>

            {/* Hidden block for PNG Generator */}
            <div className="pointer-events-none fixed -left-[9999px] top-0">
                <div
                    ref={exportRef}
                    className="w-[900px] bg-cream p-10"
                    style={{ fontFamily: "var(--font-serif)" }}
                >
                    <p className="text-xs uppercase tracking-[0.2em] text-forest/50">
                        My hudreads bookshelf
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-bold text-forest">
                        Books I&apos;ve read
                    </h2>
                    <div className="mt-8 grid grid-cols-5 gap-4">
                        {readBooks.map((book) => (
                            <div key={book.id}>
                                <div className="relative aspect-[2/3] overflow-hidden bg-beige-dark shadow-md">
                                    {book.coverUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    )}
                                </div>
                                <p className="mt-2 text-xs font-semibold text-forest line-clamp-2">
                                    {book.title}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-10 text-center text-sm text-forest/40">hudreads</p>
                </div>
            </div>
        </div>
    );
}

function BookshelfIcon() {
    return (
        <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            aria-hidden
            className="text-forest/25"
        >
            <rect x="8" y="20" width="14" height="48" rx="1" fill="currentColor" />
            <rect x="26" y="12" width="14" height="56" rx="1" fill="currentColor" />
            <rect x="44" y="24" width="14" height="44" rx="1" fill="currentColor" />
            <rect x="62" y="16" width="10" height="52" rx="1" fill="currentColor" />
        </svg>
    );
}