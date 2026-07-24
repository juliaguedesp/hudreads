"use client";

import { useEffect, useState } from "react";
import { Circle, CircleCheckBig } from "lucide-react";
import { cn, toggleReadBook, isBookRead } from "@/lib/utils";

type Props = {
    slug: string;
    className?: string;
};

export function MarkAsReadButton({ slug, className }: Props) {
    const [read, setRead] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setRead(isBookRead(slug));
    }, [slug]);

    function handleClick() {
        const nowRead = toggleReadBook(slug);
        setRead(nowRead);
    }

    if (!mounted) {
        return (
            <button
                type="button"
                disabled
                className={cn(
                    "inline-flex items-center gap-2 bg-forest/50 px-5 py-2.5 text-cream font-display",
                    className,
                )}
            >
                <Circle size={18} />
                Mark as Read
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "rounded-full inline-flex items-center gap-2 px-5 py-2.5 font-display transition-all duration-200",
                read
                    ? "bg-tan font-bold text-forest hover:opacity-90"
                    : "bg-forest text-cream hover:opacity-90",
                className,
            )}
        >
            {read ? <CircleCheckBig size={18} /> : <Circle size={18} />}
            {read ? "Marked as Read" : "Mark as Read"}
        </button>
    );
}