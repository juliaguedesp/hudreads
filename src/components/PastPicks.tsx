"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import type { Book, BookOfMonth } from "@/db/schema";

interface PastPick {
    bookOfMonth: BookOfMonth;
    book: Book;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getMonthName(monthNumber: number): string {
    if (monthNumber >= 1 && monthNumber <= 12) {
        return MONTH_NAMES[monthNumber - 1];
    }
    return "Pick";
}

function getYearShort(yearNumber: number): string {
    if (!yearNumber) return "26";
    return String(yearNumber).slice(-2);
}

export function PastPicks({ picks }: { picks: PastPick[] }) {
    if (!picks || picks.length === 0) return null;

    // Sort picks: Most recent year first (2026 > 2025), then most recent month first (8 > 7)
    const sortedPicks = [...picks].sort((a, b) => {
        const yearA = a.bookOfMonth.year ?? 0;
        const yearB = b.bookOfMonth.year ?? 0;

        if (yearA !== yearB) {
            return yearB - yearA; // Higher year first
        }

        const monthA = a.bookOfMonth.month ?? 0;
        const monthB = b.bookOfMonth.month ?? 0;

        return monthB - monthA; // Higher month number first (e.g. Aug = 8 before Jul = 7)
    });

    return (
        <section className="border-t border-forest/10 bg-cream-dark/40 py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <h3 className="font-display text-2xl font-bold text-forest text-center sm:text-left mb-6">
                    Previous Picks
                </h3>

                {/* Scrollable list */}
                <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-thin">
                    {sortedPicks.map(({ book, bookOfMonth: bom }, idx) => {
                        const monthName = getMonthName(bom.month);
                        const yearShort = getYearShort(bom.year);
                        const monthLabel = `${monthName} 20${yearShort}`;

                        return (
                            <Link
                                key={idx}
                                href={`/books/${book.slug}`}
                                className="group relative shrink-0 w-[140px] sm:w-[160px] overflow-hidden rounded-md border border-forest/10 bg-beige-dark shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                {/* Cover Image Container */}
                                <div className="relative aspect-[2/3] w-full overflow-hidden">
                                    {book.coverUrl ? (
                                        <Image
                                            src={book.coverUrl}
                                            alt={book.title}
                                            fill
                                            style={{
                                                filter: "saturate(0.4) contrast(0.9)",
                                                opacity: 0.8,
                                                transition: "all 300ms ease",
                                            }}
                                            className="object-cover group-hover:!opacity-100 group-hover:!filter-none"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-forest/5 text-xs text-forest/50">
                                            No Cover
                                        </div>
                                    )}

                                    {/* Dark Overlay Gradient on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                {/* Hover Tooltip Content */}
                                <div className="absolute inset-x-0 bottom-0 p-3 text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end">
                                    <div className="flex items-center gap-1 text-[11px] font-semibold text-tan uppercase tracking-wider mb-1">
                                        <Calendar size={12} className="shrink-0" />
                                        <span>{monthLabel}</span>
                                    </div>
                                    <p className="font-display text-xs font-bold line-clamp-1 leading-snug">
                                        {book.title}
                                    </p>
                                    <p className="text-[10px] text-cream/80 line-clamp-1">
                                        by {book.author}
                                    </p>
                                </div>

                                {/* Persistent Badge */}
                                <div className="absolute top-2 right-2 rounded-md bg-forest/80 px-2 py-0.5 text-[10px] font-display font-medium text-cream backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-0">
                                    {monthName.slice(0, 3)} &apos;{yearShort}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}