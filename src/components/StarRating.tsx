"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    value: number;
    onChange?: (value: number) => void;
    size?: number;
    readonly?: boolean;
};

export function StarRating({ value, onChange, size = 20, readonly }: Props) {
    const stars = [1, 2, 3, 4, 5];
    // Track active hover position (null means mouse is not over the component)
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Use hover value if it exists and we aren't in read-only mode, otherwise use actual value
    const displayValue = !readonly && hoverValue !== null ? hoverValue : value;

    function handleClick(star: number, isHalf: boolean) {
        if (readonly || !onChange) return;
        onChange(isHalf ? star - 0.5 : star);
    }

    return (
        <div
            className="inline-flex items-center gap-1"
            role="group"
            aria-label={`Rating: ${value} out of 5`}
            // Reset hover state when mouse completely leaves the rating area
            onMouseLeave={() => !readonly && setHoverValue(null)}
        >
            {stars.map((star) => {
                const filled = displayValue >= star;
                const half = !filled && displayValue >= star - 0.5;

                return (
                    <div
                        key={star}
                        className={cn(
                            "relative inline-block transition-transform ease-out duration-200 select-none group",
                            !readonly && "hover:scale-115 active:scale-95"
                        )}
                        style={{ width: size, height: size }}
                    >
                        {/* Base Star: Uses a light tint border and transparent fill. 
                            When active (filled or half), it turns cleanly into text-tan without 
                            any dark background lines leaking through. */}
                        <Star
                            size={size}
                            className={cn(
                                "absolute inset-0 transition-colors duration-200 ease-out text-forest/20 fill-transparent",
                                (filled || half) && "text-tan",
                                readonly && "pointer-events-none"
                            )}
                        />

                        {/* Foreground Filled Overlap Layer: Handled via width clipping percentages.
                            It is set to pointer-events-none so it doesn't block underlying hitbox click regions. */}
                        <div
                            className="absolute inset-0 overflow-hidden transition-[width] duration-200 ease-out pointer-events-none"
                            style={{ width: filled ? "100%" : half ? "50%" : "0%" }}
                        >
                            <Star
                                size={size}
                                className="text-tan fill-tan max-w-none"
                            />
                        </div>

                        {/* Interactive Hitboxes */}
                        {!readonly && onChange && (
                            <>
                                {/* Left Half Hitbox */}
                                <button
                                    type="button"
                                    className="absolute inset-y-0 left-0 w-1/2 cursor-pointer opacity-0 z-10"
                                    onClick={() => handleClick(star, true)}
                                    onMouseEnter={() => setHoverValue(star - 0.5)}
                                    aria-label={`${star - 0.5} stars`}
                                />
                                {/* Right Half Hitbox */}
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 w-1/2 cursor-pointer opacity-0 z-10"
                                    onClick={() => handleClick(star, false)}
                                    onMouseEnter={() => setHoverValue(star)}
                                    aria-label={`${star} stars`}
                                />
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}