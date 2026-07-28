"use client";

import { useCallback, useState } from "react";
import { AdminLoginModal } from "./AdminLoginModal";

export function Footer() {
    const [clicks, setClicks] = useState(0);
    const [showAdmin, setShowAdmin] = useState(false);

    const handleLogoClick = useCallback(() => {
        setClicks((prev) => {
            const next = prev + 1;
            if (next >= 5) {
                setShowAdmin(true);
                return 0;
            }
            return next;
        });
    }, []);

    return (
        <>
            <footer className="border-t border-forest/10 bg-cream py-10">
                <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
                    <button
                        type="button"
                        onClick={handleLogoClick}
                        className="font-serif text-lg text-forest transition-opacity hover:opacity-60"
                        aria-label="Hudreads"
                    >
                        HUDREADS
                    </button>
                    <p className="font-serif mx-auto max-w-xl text-xs leading-relaxed text-forest/60">
                        A fan-made reading tracker for Hudson Williams fans. Not
                        affiliated with Hudson or his team.
                    </p>
                </div>
            </footer>
            <AdminLoginModal open={showAdmin} onClose={() => setShowAdmin(false)} />
        </>
    );
}
