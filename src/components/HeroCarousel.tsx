"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
    {
        id: "library",
        href: "/library",
        eyebrow: "Browse our collection",
        title: "Hudreads",
        description: "Every book Hudson Williams has ever recommended — with community reviews, monthly picks, and your personal reading tracker.",
        cta: "Browse the library",
        bgClass: "bg-forest",
        textClass: "text-cream",
        mutedClass: "text-cream/70",
        backgroundUrl: "/hero1.gif",
    },
    {
        id: "bookshelf",
        href: "/bookshelf",
        eyebrow: "Track Your Reading",
        title: "Your Bookshelf",
        description: "Mark books as read and download a beautiful image of your personal Hudreads bookshelf.",
        cta: "View bookshelf",
        bgClass: "bg-forest",
        textClass: "text-cream",
        mutedClass: "text-cream/70",
        backgroundUrl: "/hero4.gif",
    },
    {
        id: "botm",
        href: "/book-of-the-month",
        eyebrow: "Join the club",
        title: "Book of the Month",
        description: "Check what the HudBookClub is reading this month and hop into the Discord discussion.",
        cta: "See this month's pick",
        bgClass: "bg-forest",
        textClass: "text-cream",
        mutedClass: "text-cream/70",
        backgroundUrl: "/hero2.gif",
    },
];

type Props = {
    className?: string;
    staticSlideId?: string;
};

export function HeroCarousel({ className, staticSlideId }: Props) {
    const initialIndex = staticSlideId
        ? Math.max(0, slides.findIndex(s => s.id === staticSlideId))
        : 0;

    const [active, setActive] = useState(initialIndex);

    useEffect(() => {
        if (staticSlideId) return;

        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [staticSlideId]);

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        setActive((prev) => (prev + 1) % slides.length);
    };

    const currentSlide = slides[active] || slides[0];

    return (
        <section className={cn("w-full bg-cream flex flex-col justify-between overflow-hidden", className)} style={{ minHeight: "calc(100vh - var(--header-height, 70px))" }}>
            {/* Carousel Slide Track Window - takes up remaining vertical space */}
            <div className="relative flex-1 w-full flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${active * 100}%)` }}
                >
                    {slides.map((slide) => {
                        return (
                            <div
                                key={slide.id}
                                className={cn(
                                    "relative min-w-full h-full flex items-center px-6 sm:px-12 md:px-24 py-12 transition-colors duration-500",
                                    slide.bgClass,
                                    slide.textClass
                                )}
                            >
                                {slide.backgroundUrl ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={slide.backgroundUrl}
                                            alt=""
                                            aria-hidden
                                            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                                        />
                                        <div className={cn(
                                            "pointer-events-none absolute inset-0",
                                            slide.bgClass === "bg-forest" ? "bg-forest/75" : "bg-black/35"
                                        )} />
                                    </>
                                ) : (
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-[0.07]"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(to right, #F5F0E8 1px, transparent 1px), linear-gradient(to bottom, #F5F0E8 1px, transparent 1px)",
                                            backgroundSize: "48px 48px",
                                        }}
                                    />
                                )}

                                <div className="relative mx-auto max-w-6xl w-full flex justify-between items-center gap-8">
                                    <div className="max-w-3xl">
                                        {slide.eyebrow && (
                                            <p className={cn("mb-3 text-sm font-medium uppercase tracking-[0.2em]", slide.mutedClass)}>
                                                {slide.eyebrow}
                                            </p>
                                        )}
                                        <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl tracking-tight">
                                            {slide.title}
                                        </h1>
                                        {slide.description && (
                                            <p className={cn("mt-4 max-w-2xl text-md leading-relaxed", slide.mutedClass)}>
                                                {slide.description}
                                            </p>
                                        )}

                                        <div className="mt-6">
                                            <Link
                                                href={slide.href}
                                                className="group inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
                                            >
                                                <span>{slide.cta}</span>
                                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Left & Right Control Arrows inside the main viewport layer */}
                {!staticSlideId && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-2 sm:px-6 z-10">
                        {/* Prev Control */}
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous slide"
                            className={cn(
                                "pointer-events-auto p-2 rounded-full transition-all opacity-40 hover:opacity-100",
                                currentSlide.textClass === "text-cream" ? "hover:bg-cream/10" : "hover:bg-forest/5"
                            )}
                        >
                            <ChevronLeft size={28} />
                        </button>

                        {/* Next Control */}
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next slide"
                            className={cn(
                                "pointer-events-auto p-2 rounded-full transition-all opacity-40 hover:opacity-100",
                                currentSlide.textClass === "text-cream" ? "hover:bg-cream/10" : "hover:bg-forest/5"
                            )}
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>
                )}
            </div>

            {/* Compact Pagination Indicators at the bottom edge */}
            {!staticSlideId && (
                <div className="w-full bg-cream py-3 flex items-center justify-center shrink-0 z-10">
                    <div className="flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setActive(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    i === active
                                        ? "w-8 bg-forest"
                                        : "w-2 bg-forest/25 hover:bg-forest/40"
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}