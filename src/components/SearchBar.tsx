"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    genres?: string[];
    selectedGenre?: string;
    onGenreChange?: (genre: string) => void;
};

export function SearchBar({
    value,
    onChange,
    placeholder = "Search by title or author...",
    genres = [],
    selectedGenre = "",
    onGenreChange,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking or touching outside
    useEffect(() => {
        function handleOutsideInteraction(event: MouseEvent | TouchEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideInteraction);
        document.addEventListener("touchstart", handleOutsideInteraction);
        return () => {
            document.removeEventListener("mousedown", handleOutsideInteraction);
            document.removeEventListener("touchstart", handleOutsideInteraction);
        };
    }, []);

    const displayGenreName = selectedGenre || "All Genres";
    const isPlaceholder = !selectedGenre;

    const toggleOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (e: React.SyntheticEvent, genre: string) => {
        e.preventDefault();
        e.stopPropagation();
        onGenreChange?.(genre);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest/40"
                />
                <input
                    type="search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-forest/15 bg-white py-3 pl-11 pr-4 text-forest outline-none transition-colors focus:border-forest/40 placeholder:text-forest/40"
                />
            </div>

            {/* Custom Genre Filter Dropdown */}
            {genres.length > 0 && onGenreChange && (
                <div className="relative sm:w-48" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={toggleOpen}
                        onTouchEnd={toggleOpen}
                        className="w-full flex items-center justify-between rounded-xl border border-forest/15 bg-white px-4 py-3 outline-none transition-colors hover:border-forest/40 focus:border-forest/40 text-left cursor-pointer select-none"
                    >
                        <span className={`truncate ${isPlaceholder ? "text-forest/40" : "text-forest"}`}>
                            {displayGenreName}
                        </span>
                        <ChevronDown
                            size={16}
                            className={`text-forest/40 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {isOpen && (
                        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-forest/15 bg-white py-1 shadow-lg">
                            <button
                                type="button"
                                onClick={(e) => handleSelect(e, "")}
                                onTouchEnd={(e) => handleSelect(e, "")}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-forest/5 cursor-pointer select-none ${selectedGenre === "" ? "font-semibold text-forest bg-forest/5" : "text-forest/80"
                                    }`}
                            >
                                All Genres
                            </button>
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    type="button"
                                    onClick={(e) => handleSelect(e, genre)}
                                    onTouchEnd={(e) => handleSelect(e, genre)}
                                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-forest/5 cursor-pointer select-none ${selectedGenre === genre ? "font-semibold text-forest bg-forest/5" : "text-forest/80"
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}