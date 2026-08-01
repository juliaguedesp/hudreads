"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface PastPick {
    bookOfMonth: {
        month?: number | string | null;
        monthLabel?: number | string | null;
        year?: number | string | null;
    };
    book: {
        title: string;
        author: string;
        coverUrl?: string | null;
        slug: string;
    };
}

const MONTH_MAP: Record<string, { name: string; num: number }> = {
    "1": { name: "January", num: 1 }, "01": { name: "January", num: 1 }, "jan": { name: "January", num: 1 }, "january": { name: "January", num: 1 },
    "2": { name: "February", num: 2 }, "02": { name: "February", num: 2 }, "feb": { name: "February", num: 2 }, "february": { name: "February", num: 2 },
    "3": { name: "March", num: 3 }, "03": { name: "March", num: 3 }, "mar": { name: "March", num: 3 }, "march": { name: "March", num: 3 },
    "4": { name: "April", num: 4 }, "04": { name: "April", num: 4 }, "apr": { name: "April", num: 4 }, "april": { name: "April", num: 4 },
    "5": { name: "May", num: 5 }, "05": { name: "May", num: 5 }, "may": { name: "May", num: 5 },
    "6": { name: "June", num: 6 }, "06": { name: "June", num: 6 }, "jun": { name: "June", num: 6 }, "june": { name: "June", num: 6 },
    "7": { name: "July", num: 7 }, "07": { name: "July", num: 7 }, "jul": { name: "July", num: 7 }, "july": { name: "July", num: 7 },
    "8": { name: "August", num: 8 }, "08": { name: "August", num: 8 }, "aug": { name: "August", num: 8 }, "august": { name: "August", num: 8 },
    "9": { name: "September", num: 9 }, "09": { name: "September", num: 9 }, "sep": { name: "September", num: 9 }, "september": { name: "September", num: 9 },
    "10": { name: "October", num: 10 }, "oct": { name: "October", num: 10 }, "october": { name: "October", num: 10 },
    "11": { name: "November", num: 11 }, "nov": { name: "November", num: 11 }, "november": { name: "November", num: 11 },
    "12": { name: "December", num: 12 }, "dec": { name: "December", num: 12 }, "december": { name: "December", num: 12 },
};

function getMonthDetails(bom: PastPick["bookOfMonth"]): { name: string; num: number } {
    const raw: unknown = bom?.monthLabel ?? bom?.month ?? (bom as Record<string, unknown>)?.[
        "month_label"
    ];

    if (raw === undefined || raw === null) return { name: "Pick", num: 0 };

    const key = String(raw).trim().toLowerCase();

    if (MONTH_MAP[key]) {
        return MONTH_MAP[key];
    }

    if (key.length > 0) {
        return { name: key.charAt(0).toUpperCase() + key.slice(1), num: 0 };
    }

    return { name: "Pick", num: 0 };
}

function getYearShort(bom: PastPick["bookOfMonth"]): string {
    if (!bom?.year) return "26";
    return String(bom.year).trim().slice(-2);
}

export function PastPicks({ picks }: { picks: PastPick[] }) {
    if (!picks || picks.length === 0) return null;

    // Sort picks: Most recent year first, then most recent month first
    const sortedPicks = [...picks].sort((a, b) => {
        const yearA = Number(a.bookOfMonth?.year ?? 0);
        const yearB = Number(b.bookOfMonth?.year ?? 0);

        if (yearA !== yearB) {
            return yearB - yearA; // Descending year
        }

        const monthA = getMonthDetails(a.bookOfMonth).num;
        const monthB = getMonthDetails(b.bookOfMonth).num;

        return monthB - monthA; // Descending month
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
                        const { name: monthName } = getMonthDetails(bom);
                        const yearShort = getYearShort(bom);
                        const monthLabel = `${monthName} 20${yearShort}`;

                        return (
                            <Link
                                key={idx}
                                href={`/books/${book.slug}`}
                                className="group relative shrink-0 w-[140px] sm:w-[160px] overflow-hidden border border-forest/10 bg-beige-dark shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
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