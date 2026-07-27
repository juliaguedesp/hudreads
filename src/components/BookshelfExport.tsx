"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { ImageDown, BookCheck, CirclePercent, Loader2 } from "lucide-react";
import type { Book } from "@/db/schema";
import { getReadBookSlugs } from "@/lib/utils";
import { Button } from "./Button";
import { BookCard } from "@/components/BookCard";

type Props = {
    allBooks: Book[];
};

export function BookshelfExport({ allBooks }: Props) {
    const [isExporting, setIsExporting] = useState(false);
    const [readSlugs, setReadSlugs] = useState<string[]>([]);
    const [hasMounted, setHasMounted] = useState(false);

    const exportRef = useRef<HTMLDivElement>(null);

    // Read client storage safely post-hydration
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReadSlugs(getReadBookSlugs() || []);
        setHasMounted(true);
    }, []);

    const readBooks = allBooks.filter((b) => readSlugs.includes(b.slug));

    // 📊 Stats Calculations
    const totalPagesRead = readBooks.reduce(
        (sum, book) => sum + (Number(book.pageCount) || 0),
        0
    );

    const libraryPercentage =
        allBooks.length > 0
            ? Math.round((readBooks.length / allBooks.length) * 100)
            : 0;

    async function handleDownload() {
        if (!exportRef.current || isExporting) return;
        try {
            setIsExporting(true);
            const canvas = await html2canvas(exportRef.current, {
                backgroundColor: "#1A2E26", // Rich Forest Green
                scale: 2,
                useCORS: true,
            });
            const link = document.createElement("a");
            link.download = "my-hudreads-bookshelf.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    }

    // Wait for client mount to avoid hydration mismatch
    if (!hasMounted) {
        return null;
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
                <div className="pt-2 pb-5 border-b border-forest/10 flex flex-col items-center w-full">
                    <table
                        style={{
                            display: "table",
                            width: "auto",
                            margin: "0 auto",
                            borderCollapse: "collapse",
                        }}
                    >
                        <tbody>
                            <tr style={{ display: "table-row" }}>
                                <td
                                    style={{
                                        display: "table-cell",
                                        verticalAlign: "middle",
                                        paddingRight: "12px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                        }}
                                        className="text-forest"
                                    >
                                        <BookCheck className="h-4 w-4 text-forest/50 shrink-0" />
                                        <span className="font-serif text-xs lg:text-xs text-forest/50 whitespace-nowrap">
                                            <strong className="font-bold">
                                                {totalPagesRead.toLocaleString()}
                                            </strong>{" "}
                                            pages read
                                        </span>
                                    </div>
                                </td>

                                <td
                                    style={{
                                        display: "table-cell",
                                        verticalAlign: "middle",
                                        paddingRight: "12px",
                                    }}
                                >
                                    <span className="text-forest/30 text-xs select-none">
                                        •
                                    </span>
                                </td>

                                <td
                                    style={{
                                        display: "table-cell",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                        }}
                                        className="text-forest"
                                    >
                                        <CirclePercent className="h-4 w-4 text-forest/50 shrink-0" />
                                        <span className="font-serif text-xs sm:text-xs text-forest/50 whitespace-nowrap">
                                            <strong className="font-bold">
                                                {libraryPercentage}%
                                            </strong>{" "}
                                            of library completed
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Button href="/library" className="mt-8">
                    Browse the library
                </Button>
            </div>
        );
    }

    // Split books into rows of 4 books per shelf compartment
    const shelves: Book[][] = [];
    for (let i = 0; i < readBooks.length; i += 4) {
        shelves.push(readBooks.slice(i, i + 4));
    }

    return (
        <div>
            {/* 📈 Summary Block */}
            <div className="pt-2 pb-5 border-b border-forest/10 flex flex-col items-center w-full">
                <table
                    style={{
                        display: "table",
                        width: "auto",
                        margin: "0 auto",
                        borderCollapse: "collapse",
                    }}
                >
                    <tbody>
                        <tr style={{ display: "table-row" }}>
                            {/* Pages Read Cell */}
                            <td
                                style={{
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                    paddingRight: "12px",
                                }}
                            >
                                <div
                                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                                    className="text-forest"
                                >
                                    <BookCheck className="h-4 w-4 text-forest/50 shrink-0" />
                                    <span className="font-serif text-xs lg:text-xs text-forest/50 whitespace-nowrap">
                                        <strong className="font-bold">
                                            {totalPagesRead.toLocaleString()}
                                        </strong>{" "}
                                        pages read
                                    </span>
                                </div>
                            </td>

                            {/* Separator Dot Cell */}
                            <td
                                style={{
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                    paddingRight: "12px",
                                }}
                            >
                                <span className="text-forest/30 text-xs select-none">•</span>
                            </td>

                            {/* Completed Library Cell */}
                            <td style={{ display: "table-cell", verticalAlign: "middle" }}>
                                <div
                                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                                    className="text-forest"
                                >
                                    <CirclePercent className="h-4 w-4 text-forest/50 shrink-0" />
                                    <span className="font-serif text-xs sm:text-xs text-forest/50 whitespace-nowrap">
                                        <strong className="font-bold">{libraryPercentage}%</strong>{" "}
                                        of library completed
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Display Shelf Grid on Website - Added pt-8 here to force gap below the line */}
            <div className="pt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {readBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>

            {/* Download Button Section */}
            <div className="mt-10 flex flex-col items-center w-full">
                <Button
                    onClick={handleDownload}
                    icon={isExporting ? Loader2 : ImageDown}
                    disabled={isExporting}
                    className="w-[240px] text-xs py-2.5 flex justify-center items-center gap-2 font-display"
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating Shelf...
                        </>
                    ) : (
                        "Download Bookshelf"
                    )}
                </Button>
            </div>

            {/* 🎨 HIDDEN PURE CSS WOODEN SHELF EXPORT CONTAINER */}
            <div className="pointer-events-none fixed -left-[9999px] top-0">
                <div
                    ref={exportRef}
                    style={{
                        width: "560px",
                        backgroundColor: "#1A2E26",
                        color: "#F5F0E8",
                        padding: "50px 40px 35px 40px",
                        fontFamily: "serif",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Header with Logo */}
                    <div style={{ textAlign: "center", marginBottom: "35px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.png"
                            alt="Logo"
                            style={{
                                height: "36px",
                                width: "auto",
                                display: "block",
                                margin: "0 auto 10px auto",
                                objectFit: "contain",
                            }}
                            crossOrigin="anonymous"
                        />
                        <h2
                            style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                letterSpacing: "0.15em",
                                color: "#c4a882",
                                margin: 0,
                                textTransform: "uppercase",
                            }}
                        >
                            My Hudreads Bookshelf
                        </h2>
                    </div>

                    {/* Book Cabinet Frame */}
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#12201A",
                            borderRadius: "8px 8px 4px 4px",
                            padding: "24px 20px 0px 20px",
                            boxShadow: "0 12px 28px rgba(0,0,0,0.4)",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Shelf Rows (4 books per shelf) */}
                        {shelves.map((shelfBooks, shelfIndex) => (
                            <div
                                key={shelfIndex}
                                style={{
                                    marginBottom: "18px",
                                    position: "relative",
                                }}
                            >
                                {/* Books Row */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        gap: "18px",
                                        padding: "0 10px",
                                        height: "140px",
                                        justifyContent: "center",
                                    }}
                                >
                                    {shelfBooks.map((book) => (
                                        <div
                                            key={book.id}
                                            style={{
                                                width: "82px",
                                                height: "122px",
                                                position: "relative",
                                                borderRadius: "2px",
                                                overflow: "hidden",
                                                boxShadow:
                                                    "0 6px 12px rgba(0,0,0,0.5), 2px 0 4px rgba(0,0,0,0.3)",
                                                backgroundColor: "#3E2723",
                                            }}
                                        >
                                            {book.coverUrl && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={book.coverUrl}
                                                    alt={book.title}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                    crossOrigin="anonymous"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* 🪵 Pure CSS Wooden Shelf Plank */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "16px",
                                        background:
                                            "linear-gradient(180deg, #4A2B1D 0%, #301C11 60%, #1A0F09 100%)",
                                        borderRadius: "2px",
                                        boxShadow:
                                            "0 4px 8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
                                        borderBottom: "2px solid #100805",
                                        marginTop: "0px",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Footer Stats Bar */}
                    <div
                        style={{
                            marginTop: "35px",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            color: "#F5F0E8",
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            opacity: 0.85,
                        }}
                    >
                        <span>
                            <strong style={{ fontWeight: 700 }}>{readBooks.length}</strong>{" "}
                            books read
                        </span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span>
                            <strong style={{ fontWeight: 700 }}>
                                {totalPagesRead.toLocaleString()}
                            </strong>{" "}
                            pages total
                        </span>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <span>
                            <strong style={{ fontWeight: 700 }}>{libraryPercentage}%</strong>{" "}
                            completed
                        </span>
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