"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { StarRating } from "./StarRating";
import { Button } from "./Button";
import { saveReviewToken } from "@/lib/utils";
import { READING_FORMAT_LABELS } from "@/lib/validations";

// 🛠️ Dynamically load the editor to prevent Next.js SSR build errors
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[180px] rounded-xl border border-forest/10 bg-forest/[0.04] animate-pulse" />
    ),
});

type Props = {
    bookId: string;
    onSubmitted: () => void;
};

export function ReviewForm({ bookId, onSubmitted }: Props) {
    const [name, setName] = useState("");
    const [twitter, setTwitter] = useState("");
    const [readingFormat, setReadingFormat] = useState("");
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const modules = {
        toolbar: [
            ["bold", "italic", "strike"],
            ["blockquote", { header: 3 }],
            [{ list: "ordered" }, { list: "bullet" }]
        ],
    };

    const formats = [
        "bold",
        "italic",
        "strike",
        "blockquote",
        "header",
        "list"
    ];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (rating < 0.5) {
            setError("Please select a rating.");
            return;
        }

        const finalReviewText = (reviewText === "<p><br></p>" || !reviewText) ? null : reviewText;

        setLoading(true);
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bookId,
                name,
                twitter,
                readingFormat: readingFormat || null,
                rating,
                reviewText: finalReviewText,
            }),
        });

        setLoading(false);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Failed to submit review.");
            return;
        }

        const data = await res.json();
        if (data.editToken) {
            saveReviewToken(data.id, data.editToken);
        }

        setName("");
        setTwitter("");
        setReadingFormat("");
        setRating(0);
        setReviewText("");
        onSubmitted();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 border border-forest/5 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-display text-lg font-bold text-forest">
                Leave a review
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="rounded-xl block text-sm font-medium tracking-wider text-forest/70">
                        Your name <span className="text-red-600">*</span>
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your name"
                        className="mt-1.5 w-full rounded-xl border border-forest/10 bg-forest/[0.04] px-3 py-2.5 text-sm text-forest placeholder-forest/40 outline-none transition-colors focus:bg-forest/[0.06] focus:border-forest/20"
                    />
                </div>
                <div>
                    <label className="rounded-xl block text-sm font-medium tracking-wider text-forest/70">
                        Twitter / X username <span className="text-red-600">*</span>
                    </label>
                    <input
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="@twitter"
                        required
                        className="mt-1.5 w-full rounded-xl border border-forest/10 bg-forest/[0.04] px-3 py-2.5 text-sm text-forest placeholder-forest/40 outline-none transition-colors focus:bg-forest/[0.06] focus:border-forest/20"
                    />
                </div>
            </div>

            <div>
                <label className="rounded-xl block text-sm font-medium tracking-wider text-forest/70">
                    How did you read it?
                </label>
                <select
                    value={readingFormat}
                    onChange={(e) => setReadingFormat(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-forest/10 bg-forest/[0.04] px-3 py-2.5 text-sm text-forest outline-none transition-colors focus:bg-forest/[0.06] focus:border-forest/20"
                >
                    <option value="" className="bg-white">Select format</option>
                    {Object.entries(READING_FORMAT_LABELS).map(([value, label]) => (
                        <option key={value} value={value} className="bg-white">
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium tracking-wider text-forest/70">
                    Rating <span className="text-red-600">*</span>
                </label>
                <div className="mt-1">
                    <StarRating value={rating} onChange={setRating} size={24} />
                </div>
            </div>

            {/* 🛠️ Quill Rich Text Editor */}
            <div className="quill-input-container">
                <label className="rounded-xl block text-sm font-medium tracking-wider text-forest/70 mb-2">
                    Your review
                </label>

                <div className="overflow-hidden rounded-xl border border-forest/10 bg-forest/[0.04] focus-within:bg-forest/[0.06] focus-within:border-forest/20 transition-colors">
                    <ReactQuill
                        theme="snow"
                        value={reviewText}
                        onChange={setReviewText}
                        modules={modules}
                        formats={formats}
                        placeholder="Write your thoughts about this book..."
                    />
                </div>

                {/* 🎨 Scoped Styles Overrides */}
                <style jsx global>{`
                    .quill-input-container .ql-toolbar.ql-snow {
                        border: none !important;
                        border-bottom: 1px solid rgba(4, 47, 31, 0.1) !important;
                        background: rgba(4, 47, 31, 0.01) !important;
                        padding: 8px 12px !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 8px !important;
                    }
                    .quill-input-container .ql-formats {
                        border: 1px solid rgba(4, 47, 31, 0.15) !important;
                        background-color: #ffffff !important;
                        border-radius: 6px !important;
                        margin-right: 0 !important;
                        display: inline-flex !important;
                        overflow: hidden !important;
                    }
                    .quill-input-container .ql-formats button {
                        width: 30px !important;
                        height: 28px !important;
                        padding: 5px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        background: transparent !important;
                        border: none !important;
                        color: #042f1f !important;
                    }
                    .quill-input-container .ql-formats button.ql-bold {
                        font-weight: normal !important;
                        padding: 6px !important;
                    }
                    .quill-input-container .ql-formats button + button {
                        border-left: 1px solid rgba(4, 47, 31, 0.15) !important;
                        border-radius: 0 !important;
                    }
                    .quill-input-container .ql-formats button svg {
                        width: 14px !important;
                        height: 14px !important;
                        max-width: 14px !important;
                        max-height: 14px !important;
                    }
                    .quill-input-container .ql-stroke {
                        stroke: #042f1f !important;
                        stroke-width: 2px !important;
                    }
                    .quill-input-container .ql-fill {
                        fill: #042f1f !important;
                    }
                    .quill-input-container .ql-formats button:hover {
                        background-color: rgba(4, 47, 31, 0.05) !important;
                    }
                    .quill-input-container .ql-active,
                    .quill-input-container .ql-formats button.ql-active {
                        background-color: rgba(4, 47, 31, 0.08) !important;
                    }

                    /* ❌ Remove default Quill focus outline styling quirks */
                    .quill-input-container .ql-container.ql-snow {
                        border: none !important;
                        outline: none !important;
                        font-family: inherit !important;
                    }
                    .quill-input-container .ql-container.ql-snow:focus,
                    .quill-input-container .ql-container.ql-snow:focus-within {
                        border: none !important;
                        outline: none !important;
                    }

                    .quill-input-container .ql-editor {
                        min-height: 140px;
                        font-size: 0.875rem !important;
                        color: #042f1f !important;
                        line-height: 1.6 !important;
                        padding: 14px !important;
                        outline: none !important;
                    }
                    .quill-input-container .ql-editor.ql-blank::before {
                        color: rgba(4, 47, 31, 0.4) !important;
                        font-style: normal !important;
                        left: 14px !important;
                        right: 14px !important;
                    }
                    
                    /* 📝 Node structure spacing rules within working area */
                    .quill-input-container .ql-editor h3 {
                        font-size: 1.25rem !important;
                        font-weight: 700 !important;
                        margin-top: 1rem !important;
                        margin-bottom: 0.5rem !important;
                    }
                    .quill-input-container .ql-editor blockquote {
                        border-left: 4px solid rgba(4, 47, 31, 0.3) !important;
                        padding-left: 1rem !important;
                        color: rgba(4, 47, 31, 0.7) !important;
                        font-style: italic !important;
                        margin: 1rem 0 !important;
                    }
                    .quill-input-container .ql-editor ul, 
                    .quill-input-container .ql-editor ol {
                        padding-left: 1.5rem !important;
                        margin: 0.5rem 0 !important;
                    }
                    .quill-input-container .ql-editor ul {
                        list-style-type: disc !important;
                    }
                    .quill-input-container .ql-editor ol {
                        list-style-type: decimal !important;
                    }
                `}</style>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <div className="pt-2">
                <Button type="submit" disabled={loading}>
                    {loading ? "Posting..." : "Post"}
                </Button>
            </div>
        </form>
    );
}