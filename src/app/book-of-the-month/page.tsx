import Image from "next/image";
import { MessageCircleHeart, StarPlus } from "lucide-react";
import { HeroBanner } from "@/components/HeroBanner";
import { Button } from "@/components/Button";
import { getActiveBookOfMonth } from "@/lib/queries";
import { formatMonthYear } from "@/lib/utils";

export const metadata = {
    title: "Book of the Month",
};

export const dynamic = "force-dynamic";

export default async function BookOfMonthPage() {
    let pick = null;

    try {
        pick = await getActiveBookOfMonth();
        console.log("📅 [BOM QUERY SUCCESS] Returned row payload:", pick);
    } catch (error) {
        console.error("❌ [BOM QUERY EXCEPTION] Database fetch crashed:", error);
        pick = null;
    }

    if (!pick) {
        console.log("⚠️ [BOM EMPTY] Query returned null or undefined. Showing fallback screen.");
        return (
            <>
                <HeroBanner eyebrow="Book club" title="Book of the Month" />
                <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
                    <p className="text-forest/60">
                        No book of the month selected yet. Check back soon!
                    </p>
                </section>
            </>
        );
    }

    const { book, bookOfMonth: bom } = pick;

    const getSafeEyebrowDate = (): string => {
        try {
            const rawMonth: unknown = bom.month;
            const rawYear: unknown = bom.year;

            if (typeof rawMonth === "string" && isNaN(Number(rawMonth))) {
                return `${rawMonth} ${rawYear}`;
            }

            const m = typeof rawMonth === "number" ? rawMonth : parseInt(String(rawMonth), 10);
            const y = typeof rawYear === "number" ? rawYear : parseInt(String(rawYear), 10);

            if (!isNaN(m) && !isNaN(y)) {
                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                const monthName = monthNames[m - 1] || formatMonthYear(m, y);
                return `${monthName} ${y}`;
            }
        } catch (e) {
            console.error("Failed parsing eyebrow date metrics:", e);
        }

        return "August 2026";
    };

    return (
        <>
            <HeroBanner
                eyebrow={getSafeEyebrowDate()}
                title="Book of the Month"
            />
            {/* 🛠️ Matches HeroBanner container padding and max width */}
            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
                <div className="flex flex-col sm:flex-row items-start justify-center gap-8 sm:gap-12 max-w-4xl mx-auto">
                    {/* Fixed 250px cover size */}
                    <div className="shrink-0 overflow-hidden border border-forest/10 bg-beige-dark shadow-lg rounded-sm mx-auto sm:mx-0">
                        {book.coverUrl && (
                            <Image
                                src={book.coverUrl}
                                alt={book.title}
                                width={250}
                                height={375}
                                className="h-auto w-[250px] object-cover"
                                priority
                            />
                        )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 min-w-0">
                        <h2 className="font-display text-3xl font-bold text-forest sm:text-4xl">
                            {book.title}
                        </h2>
                        <p className="mt-2 text-lg text-forest/70">by {book.author}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {(() => {
                                const rawGenre = book.genre;
                                if (!rawGenre) return null;

                                const genreArray: string[] = Array.isArray(rawGenre)
                                    ? rawGenre
                                    : String(rawGenre).split(",");

                                return genreArray
                                    .map((g) => g.trim())
                                    .filter(Boolean)
                                    .map((individualGenre, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-forest border border-forest/[0.02] px-3 py-1.5 text-sm font-display font-medium text-cream shadow-sm"
                                        >
                                            {individualGenre}
                                        </span>
                                    ));
                            })()}

                            {book.pageCount && (
                                <span className="rounded-full bg-tan border border-forest/[0.02] px-3 py-1.5 font-serif font-bold text-xs text-forest/80 shadow-sm">
                                    {book.pageCount} pages
                                </span>
                            )}
                        </div>

                        {book.hudsonReference && (
                            <blockquote className="mt-6 border-l-4 border-tan pl-4 italic text-forest/80">
                                {book.hudsonReference}
                            </blockquote>
                        )}

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button
                                href="https://x.com/hudsbookclub"
                                variant="secondary"
                                icon={MessageCircleHeart}
                                external
                            >
                                Join the Club
                            </Button>
                            <Button
                                href={`/books/${book.slug}`}
                                variant="secondary"
                                icon={StarPlus}
                            >
                                Browse Reviews
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}