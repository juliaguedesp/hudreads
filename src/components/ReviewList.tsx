"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, X, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { StarRating } from "./StarRating";
import { getReviewToken, removeReviewToken } from "@/lib/utils";
import { READING_FORMAT_LABELS } from "@/lib/validations";
import type { Review } from "@/db/schema";

type Props = {
    reviews: Review[];
    isAdmin: boolean;
    onChanged: () => void;
};

export function ReviewList({ reviews, isAdmin, onChanged }: Props) {
    if (reviews.length === 0) {
        return (
            <p className="text-forest/60">
                No reviews yet. Be the first to share your thoughts!
            </p>
        );
    }

    return (
        <div className="space-y-4 w-full max-w-full">
            {reviews.map((review) => (
                <ReviewItem
                    key={review.id}
                    review={review}
                    isAdmin={isAdmin}
                    onChanged={onChanged}
                />
            ))}
        </div>
    );
}

function ReviewItem({
    review,
    isAdmin,
    onChanged,
}: {
    review: Review;
    isAdmin: boolean;
    onChanged: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(review.name);
    const [twitter, setTwitter] = useState(review.twitter);
    const [readingFormat, setReadingFormat] = useState(review.readingFormat ?? "");
    const [rating, setRating] = useState(parseFloat(review.rating));
    const [reviewText, setReviewText] = useState(review.reviewText ?? "");
    const [loading, setLoading] = useState(false);

    // Read More state & DOM measurement ref
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const canEdit = isAdmin || !!getReviewToken(review.id);

    // Detect if content height exceeds ~10 lines (~260px)
    useEffect(() => {
        if (!editing && contentRef.current) {
            const clientHeight = contentRef.current.clientHeight;
            const scrollHeight = contentRef.current.scrollHeight;

            if (scrollHeight > 260 || scrollHeight > clientHeight + 10) {
                setIsClamped(true);
            } else {
                setIsClamped(false);
            }
        }
    }, [review.reviewText, editing]);

    async function handleUpdate() {
        setLoading(true);
        try {
            const res = await fetch(`/api/reviews/${review.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    editToken: getReviewToken(review.id),
                    name,
                    twitter,
                    readingFormat: readingFormat || null,
                    rating,
                    reviewText: reviewText || null,
                }),
            });

            if (res.ok) {
                setEditing(false);
                onChanged();
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.error || "Failed to update review.");
            }
        } catch (err) {
            console.error("Update request error:", err);
            alert("An error occurred while updating the review.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this review?")) return;
        setLoading(true);

        try {
            const editToken = getReviewToken(review.id);

            const res = await fetch(`/api/reviews/${review.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(editToken ? { "x-edit-token": editToken } : {}),
                },
                body: JSON.stringify({ editToken }),
            });

            if (res.ok) {
                removeReviewToken(review.id);
                onChanged();
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.error || "Failed to delete review.");
            }
        } catch (err) {
            console.error("Delete request error:", err);
            alert("An error occurred while deleting the review.");
        } finally {
            setLoading(false);
        }
    }

    if (editing) {
        return (
            <div className="border border-forest/10 bg-white p-5 rounded-xl w-full max-w-full box-border">
                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-forest/20 px-3 py-2 rounded-lg text-sm text-forest"
                    />
                    <input
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="border border-forest/20 px-3 py-2 rounded-lg text-sm text-forest"
                    />
                </div>
                <select
                    value={readingFormat}
                    onChange={(e) => setReadingFormat(e.target.value)}
                    className="mt-3 w-full border border-forest/20 bg-white px-3 py-2 rounded-lg text-sm text-forest"
                >
                    <option value="">Format (optional)</option>
                    {Object.entries(READING_FORMAT_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                <div className="mt-3">
                    <StarRating value={rating} onChange={setRating} size={24} />
                </div>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={5}
                    className="mt-3 w-full border border-forest/20 px-3 py-2 font-mono text-xs rounded-lg text-forest"
                    placeholder="HTML content structure strings can be modified manually here..."
                />
                <div className="mt-3 flex gap-2">
                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={loading}
                        className="inline-flex items-center gap-1 bg-forest px-3 py-1.5 text-sm text-cream rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        <Check size={14} /> Save
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-forest/70 font-medium hover:text-forest"
                    >
                        <X size={14} /> Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <article className="border border-forest/10 bg-white p-5 rounded-xl shadow-sm w-full max-w-full overflow-hidden box-border">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="font-semibold text-forest truncate">{review.name}</p>
                    {review.twitter && (
                        <a
                            href={`https://twitter.com/${review.twitter.replace(/^@/, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-forest/60 transition-opacity hover:opacity-70 truncate block mt-0.5"
                        >
                            @{review.twitter.replace(/^@/, "")}
                        </a>
                    )}
                </div>
                {canEdit && (
                    <div className="flex gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="text-forest/50 transition-colors hover:text-forest"
                            aria-label="Edit review"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="text-forest/50 transition-colors hover:text-red-700 disabled:opacity-50"
                            aria-label="Delete review"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <StarRating value={parseFloat(review.rating)} readonly size={18} />
                {review.readingFormat && (
                    <span className="text-xs uppercase tracking-wide text-forest/60 font-medium">
                        {READING_FORMAT_LABELS[review.readingFormat as keyof typeof READING_FORMAT_LABELS] ?? review.readingFormat}
                    </span>
                )}
            </div>

            {review.reviewText && (
                <div className="relative mt-4">
                    <div
                        ref={contentRef}
                        className={`review-rendered-content prose text-sm text-forest/80 font-serif max-w-full transition-all duration-300 relative overflow-hidden ${isClamped && !isExpanded ? "max-h-[260px]" : "max-h-none"
                            }`}
                        dangerouslySetInnerHTML={{
                            __html: review.reviewText.replaceAll("&nbsp;", " "),
                        }}
                    />

                    {/* Gradient Fade Overlay */}
                    {isClamped && !isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                    )}

                    {/* Toggle Button */}
                    {isClamped && (
                        <div className="relative z-10 pt-1 bg-white">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-flex items-center text-xs font-semibold text-forest/80 hover:opacity-50 focus:outline-none transition-opacity"
                            >
                                {isExpanded ? (
                                    <>
                                        Show less <ArrowLeft size={14} />
                                    </>
                                ) : (
                                    <>
                                        Read more <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Scoped Global Overrides */}
            <style jsx global>{`
                .review-rendered-content,
                .review-rendered-content * {
                    word-break: normal !important;
                    overflow-wrap: anywhere !important;
                    white-space: normal !important;
                }
                .review-rendered-content p {
                    line-height: 1.625 !important;
                    margin-bottom: 1rem !important;
                    display: block !important;
                }
                .review-rendered-content p:last-child {
                    margin-bottom: 0 !important;
                }
                .review-rendered-content h1,
                .review-rendered-content h2,
                .review-rendered-content h3 {
                    font-family: var(--font-display), sans-serif !important;
                    font-weight: 700 !important;
                    color: #042f1f !important;
                    margin-top: 1.5rem !important;
                    margin-bottom: 0.75rem !important;
                    line-height: 1.3 !important;
                }
                .review-rendered-content h1 { font-size: 1.5rem !important; }
                .review-rendered-content h2 { font-size: 1.3rem !important; }
                .review-rendered-content h3 { font-size: 1.15rem !important; }
                
                .review-rendered-content blockquote {
                    border-left: 3px solid rgba(4, 47, 31, 0.3) !important;
                    padding-left: 1.25rem !important;
                    color: rgba(4, 47, 31, 0.7) !important;
                    font-style: italic !important;
                    margin: 1.25rem 0 !important;
                    line-height: 1.6 !important;
                    display: block !important;
                }
                .review-rendered-content ul, 
                .review-rendered-content ol {
                    padding-left: 1.5rem !important;
                    margin: 1rem 0 !important;
                    display: block !important;
                }
                .review-rendered-content ul { list-style-type: disc !important; }
                .review-rendered-content ol { list-style-type: decimal !important; }
                .review-rendered-content li { 
                    margin-bottom: 0.5rem !important; 
                    line-height: 1.5 !important;
                }
                .review-rendered-content li:last-child { 
                    margin-bottom: 0 !important; 
                }
            `}</style>
        </article>
    );
}