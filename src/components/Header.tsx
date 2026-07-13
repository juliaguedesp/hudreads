"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/library", label: "Library" },
    { href: "/bookshelf", label: "Bookshelf" },
    { href: "/book-of-the-month", label: "Book of the Month" },
];

export function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isClient] = useState(() => typeof window !== "undefined");

    // Auto-close dropdown if the user resizes to desktop view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Prevent main body background from scrolling when mobile drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <header className="sticky top-0 left-0 z-50 border-b border-forest/10 bg-cream/80 backdrop-blur-md w-full transform translate-z-0 backface-hidden">
            {/* 🌟 FIXED HEIGHT COMPACT CONTAINER: 
               Locked at a clean, standard header size via vertical padding (py-2 sm:py-2.5).
               It will never grow or balloon out from the logo anymore.
            */}
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 gap-4">

                {/* LOGO LINK CONTAINER */}
                <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="transition-opacity hover:opacity-70 shrink-0 flex items-center justify-start"
                >
                    {/* 💡 PERFECT LOGO HEIGHT CALIBRATION:
                      We control the asset strictly by height ('h-8' on mobile, 'sm:h-10' on desktop) with a clean top/bottom padding buffer.
                      - Change 'h-8' (e.g., h-7 or h-9) to tweak its exact vertical size on mobile.
                      - Change 'sm:h-10' (e.g., sm:h-9 or sm:h-11) to tweak its exact vertical size on desktop.
                      Since the height is hard-coded here, it keeps your header short and neat.
                    */}
                    <div className="relative h-8 sm:h-10 w-auto flex items-center justify-center">
                        <Image
                            src="/logo.png"
                            alt="hudreads logo"
                            width={100}
                            height={100}
                            className="h-full w-auto object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Inline Navigation Links */}
                <nav className="hidden md:flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm sm:text-base font-medium transition-opacity hover:opacity-60 whitespace-nowrap tracking-wide border-b-2 pb-0.5 transition-colors duration-200",
                                isClient && pathname === link.href
                                    ? "font-bold text-forest border-forest"
                                    : "text-forest/80 border-transparent",
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Hamburger Button Trigger */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                    className="flex md:hidden items-center justify-center p-1.5 text-forest transition-opacity hover:opacity-70 focus:outline-none"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown Slide Panel */}
            <div
                className={cn(
                    "absolute left-0 w-full bg-cream border-b border-forest/10 transition-all duration-300 ease-in-out md:hidden overflow-hidden z-40 shadow-sm",
                    isOpen ? "top-full max-h-60 opacity-100" : "top-[-300px] max-h-0 opacity-0 pointer-events-none"
                )}
            >
                <nav className="flex flex-col p-4 space-y-2 bg-cream">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-all duration-200",
                                isClient && pathname === link.href
                                    ? "bg-forest/10 text-forest font-bold rounded-full"
                                    : "text-forest/70 hover:text-forest hover:bg-forest/5 rounded-full"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}