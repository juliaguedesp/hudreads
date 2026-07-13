"use client";

import { Search } from "lucide-react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export function SearchBar({
    value,
    onChange,
    placeholder = "Search by title, author, or genre...",
}: Props) {
    return (
        <div className="relative">
            <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest/40"
            />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-forest/15 bg-white py-3 pl-11 pr-4 text-forest outline-none transition-colors focus:border-forest/40"
            />
        </div>
    );
}
