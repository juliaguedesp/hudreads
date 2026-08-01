import Image from "next/image";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { MarkAsReadButton } from "@/components/MarkAsReadButton";
import { BookReviews } from "@/components/BookReviews";
import { isAdminAuthenticated } from "@/lib/admin";
import { getBookBySlug, getReviewsForBook } from "@/lib/queries";
import type { Book, Review } from "@/db/schema";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const book = await getBookBySlug(decodedSlug).catch(() => null);
    if (!book) return { title: "Book not found" };
    return {
        title: book.title,
        description: `${book.title} by ${book.author} — a Hudson Williams recommendation on hudreads.`,
    };
}

export default async function BookPage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    let book: Book | null = null;
    let bookReviews: Review[] = [];
    let isAdmin = false;

    try {
        book = await getBookBySlug(decodedSlug);
        if (book) {
            bookReviews = await getReviewsForBook(book.id);
        }
        isAdmin = await isAdminAuthenticated();
    } catch (queryError) {
        console.error(`❌ [QUERY EXCEPTION] Database fetch failed:`, queryError);
        book = null;
    }

    if (!book) {
        notFound();
    }

    // Split synopsis safely into discrete paragraphs to preserve structure
    const synopsisParagraphs = book.synopsis
        ? book.synopsis.split(/\r?\n/).filter((p) => p.trim() !== "")
        : [];

    return (
        <>
            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-[240px_1fr]">

                    {/* Left Frame: Book Cover Frame */}
                    <div>
                        <div className="relative mx-auto aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-none border border-forest/10 bg-beige-dark shadow-md">
                            {book.coverUrl ? (
                                <Image
                                    src={book.coverUrl}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    sizes="240px"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-forest/30">
                                    No cover
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-center">
                            <MarkAsReadButton slug={book.slug} />
                        </div>
                    </div>

                    {/* Right Main Grid Area */}
                    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">

                        {/* Column A: Title, Tags, and Synopsis */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="font-display text-4xl font-bold text-forest">{book.title}</h1>
                                <p className="text-xl text-forest/60 py-0.5 font-serif italic mt-1">
                                    by {book.author}
                                    {book.publishedYear && <span className="text-forest/80 font-serif not-italic text-sm ml-2"> • {book.publishedYear}</span>}
                                </p>

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
                                                className="rounded-full bg-forest border border-forest/[0.02] px-3 py-1.5 text-sm font-display font-medium text-cream shadow-sm"
                                            >
                                                {individualGenre}
                                            </span>
                                        ))}

                                    {book.pageCount && (
                                        <span className="rounded-full bg-tan border border-forest/[0.02] px-3 py-1.5 font-serif font-bold text-xs text-forest/80 shadow-sm">
                                            {book.pageCount} pages
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Synopsis Text Block with Restored Justification */}
                            {synopsisParagraphs.length > 0 && (
                                <div className="pt-2">
                                    <h3 className="font-serif text-xl font-medium text-forest mb-2">Synopsis</h3>
                                    <div className="space-y-4 text-justify leading-normal text-forest/80 text-xl font-display">
                                        {synopsisParagraphs.map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Column B: Sidebars */}
                        <div className="space-y-8">
                            {/* Panel: Hudson Reference */}
                            {book.hudsonReference && (
                                <div className="rounded-xl border border-forest/10 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-2 text-forest">
                                        <Sparkles size={18} className="shrink-0 text-tan" />
                                        <h2 className="font-display text-forest text-lg font-bold">
                                            Hudson & {book.title}
                                        </h2>
                                    </div>
                                    <p className="mt-3 font-serif text-sm align-justify leading-relaxed text-forest/70">
                                        {book.hudsonReference}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Review Workspace Border Section Panels */}
                <div className="mt-6 pt-6 sm:mt-16 sm:pt-16 border-t border-forest/10 w-full max-w-full">
                    <BookReviews
                        bookId={book.id}
                        initialReviews={bookReviews}
                        isAdmin={isAdmin}
                    />
                </div>
            </section>
        </>
    );
}