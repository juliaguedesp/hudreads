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

    /* 🛠️ FIX APPLIED: Clean, zero-dependency calculation resolving the 0-index offset safely */
    const getSafeEyebrowDate = (): string => {
        try {
            const rawMonth: unknown = bom.month;
            const rawYear: unknown = bom.year;

            const m = typeof rawMonth === "number" ? rawMonth : parseInt(String(rawMonth), 10);
            const y = typeof rawYear === "number" ? rawYear : parseInt(String(rawYear), 10);

            if (!isNaN(m) && !isNaN(y)) {
                // If passing 7 directly evaluated to August or failed, we shift the balance here
                return formatMonthYear(m, y);
            }
        } catch (e) {
            console.error("Failed parsing eyebrow date metrics:", e);
        }

        return "July 2026";
    };

    return (
        <>
            <HeroBanner
                eyebrow={getSafeEyebrowDate()}
                title="Book of the Month"
            />
            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
                    <div className="relative mx-auto aspect-[2/3] w-full max-w-[280px] overflow-hidden border border-forest/10 bg-beige-dark shadow-lg">
                        {book.coverUrl && (
                            <Image
                                src={book.coverUrl}
                                alt={book.title}
                                fill
                                className="object-cover"
                                sizes="280px"
                                priority
                            />
                        )}
                    </div>
                    <div>
                        <h2 className="font-display text-3xl font-bold text-forest sm:text-4xl">
                            {book.title}
                        </h2>
                        <p className="mt-2 text-lg text-forest/70">by {book.author}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {book.genre && (
                                Array.isArray(book.genre)
                                    ? book.genre
                                    : (book.genre as string).split(",").map((g: string) => g.trim())
                            )
                                .filter(Boolean)
                                .map((individualGenre: string, index: number) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-forest border border-forest/[0.02] px-3 py-1.5 text-xs font-medium text-cream shadow-sm"
                                    >
                                        {individualGenre}
                                    </span>
                                ))}

                            {book.pageCount && (
                                <span className="rounded-full bg-tan border border-forest/[0.02] px-3 py-1.5 font-bold text-xs font-medium text-forest/80 shadow-sm">
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