"use client";

import { useCallback, useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import type { Review } from "@/db/schema";

type Props = {
    bookId: string;
    initialReviews: Review[];
    isAdmin: boolean;
};

export function BookReviews({ bookId, initialReviews, isAdmin }: Props) {
    // Use a key-syncing strategy or standard tracking state to prevent unneeded effect hooks
    const [reviews, setReviews] = useState(initialReviews);
    const [prevInitialReviews, setPrevInitialReviews] = useState(initialReviews);

    // Synchronize state directly during render loop if the parent props change 
    // This is the officially recommended React pattern instead of useEffect
    if (initialReviews !== prevInitialReviews) {
        setReviews(initialReviews);
        setPrevInitialReviews(initialReviews);
    }

    const refresh = useCallback(async () => {
        const res = await fetch(`/api/reviews?bookId=${bookId}`);
        if (res.ok) {
            setReviews(await res.json());
        }
    }, [bookId]);

    return (
        /* 🛠️ FORCE SIDE-BY-SIDE VIA INLINE CSS RULES:
          If Tailwind classes are cached or stuck in Turbopack memory, 
          these standard inline elements will take absolute priority 
          over the layout renderer without requiring any terminal deletion.
        */
        <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start w-full max-w-full overflow-hidden"
            style={{
                display: "grid",
                alignItems: "start",
                width: "100%",
                maxWidth: "100%"
            }}
        >

            {/* Left Column Component Layout Area: The Submission Box */}
            <div className="w-full min-w-0 h-fit" style={{ width: "100%", minWidth: 0, height: "fit-content" }}>
                {/* 🌟 Tiny Change: Added an invisible timestamp spacer keyword attribute.
                    Changing any basic HTML string attribute inside your file forces 
                    Next.js to immediately discard the layout file memory cache 
                    and perform an instant code hot-reload on your screen. */}
                <div data-refresh-token="force-layout-update-v1">
                    <ReviewForm bookId={bookId} onSubmitted={refresh} />
                </div>
            </div>

            {/* Right Column Component Layout Area: The Community Feed */}
            <div className="w-full min-w-0 h-fit" style={{ width: "100%", minWidth: 0, height: "fit-content" }}>
                <h3 className="mb-4 font-display text-xl font-bold text-forest">
                    Community reviews ({reviews.length})
                </h3>
                <ReviewList reviews={reviews} isAdmin={isAdmin} onChanged={refresh} />
            </div>

        </div>
    );
}