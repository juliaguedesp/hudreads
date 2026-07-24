"use client";

import { useRef, useState } from "react";
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
    const [readSlugs] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];
        return getReadBookSlugs() || [];
    });

    const exportRef = useRef<HTMLDivElement>(null);

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
            useCORS: true,
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

    // Split books into rows of up to 4 books per shelf compartment
    const shelves: Book[][] = [];
    for (let i = 0; i < readBooks.length; i += 4) {
        shelves.push(readBooks.slice(i, i + 4));
    }

    return (
        <div>
            {/* 📈 Summary Block */}
            <div className="mb-6 pb-6 border-b border-forest/10 flex flex-col items-center w-full">
                <table
                    style={{
                        display: "table",
                        width: "auto",
                        margin: "0 auto",
                        borderCollapse: "collapse"
                    }}
                >
                    <tbody>
                        <tr style={{ display: "table-row" }}>
                            {/* Pages Read Cell */}
                            <td style={{ display: "table-cell", verticalAlign: "middle", paddingRight: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} className="text-forest">
                                    <BookCheck className="h-4 w-4 text-forest/50 shrink-0" />
                                    <span className="font-serif text-xs lg:text-xs text-forest/50 whitespace-nowrap">
                                        <strong className="font-bold">{totalPagesRead.toLocaleString()}</strong> pages read
                                    </span>
                                </div>
                            </td>

                            {/* Separator Dot Cell */}
                            <td style={{ display: "table-cell", verticalAlign: "middle", paddingRight: "12px" }}>
                                <span className="text-forest/30 text-xs select-none">•</span>
                            </td>

                            {/* Completed Library Cell */}
                            <td style={{ display: "table-cell", verticalAlign: "middle" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} className="text-forest">
                                    <CirclePercent className="h-4 w-4 text-forest/50 shrink-0" />
                                    <span className="font-serif text-xs sm:text-xs text-forest/50 whitespace-nowrap">
                                        <strong className="font-bold">{libraryPercentage}%</strong> of library completed
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Display Shelf Grid on Website */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {readBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>

            {/* Download Button Section */}
            <div className="mt-10 flex flex-col items-center w-full">
                <Button
                    onClick={handleDownload}
                    icon={Save}
                    className="w-[240px] text-xs py-2.5 flex justify-center"
                >
                    Download Bookshelf
                </Button>
            </div>

            {/* Hidden Realistic Cabinet PNG Generator Container */}
            <div className="pointer-events-none fixed -left-[9999px] top-0">
                <div
                    ref={exportRef}
                    style={{
                        width: "800px",
                        height: "1050px",
                        backgroundColor: "#F5F0E8",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingBottom: "35px",
                    }}
                >
                    {/* Header Title with inverted dark forest text */}
                    <div style={{ position: "absolute", top: "35px", width: "100%", textAlign: "center" }}>
                        <h2 style={{ fontSize: "20px", fontFamily: "serif", fontWeight: "600", letterSpacing: "0.2em", color: "#1A2E26", margin: 0, textTransform: "uppercase" }}>
                            MY HUDREADS BOOKSHELF
                        </h2>
                    </div>

                    {/* Bookshelf Background Image Container */}
                    <div
                        style={{
                            width: "720px",
                            height: "920px",
                            position: "relative",
                            backgroundImage: `url('/bookshelf-bg.png')`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* Render up to 5 shelf rows adjusted down to sit squarely on the wood shelves */}
                        {shelves.slice(0, 5).map((shelfBooks, shelfIndex) => {
                            const shelfTops = ["230px", "395px", "560px", "725px", "890px"];
                            const topCoord = shelfTops[shelfIndex] || "230px";

                            return (
                                <div
                                    key={shelfIndex}
                                    style={{
                                        position: "absolute",
                                        top: topCoord,
                                        left: "90px",
                                        right: "90px",
                                        height: "130px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "flex-end",
                                        gap: "28px",
                                    }}
                                >
                                    {shelfBooks.map((book) => (
                                        <div
                                            key={book.id}
                                            style={{
                                                width: "85px",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "85px",
                                                    height: "122px",
                                                    position: "relative",
                                                    backgroundColor: "#3E2723",
                                                    boxShadow: "-4px 8px 14px rgba(0, 0, 0, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.3)",
                                                    borderRadius: "2px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {book.coverUrl && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                                                        crossOrigin="anonymous"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
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