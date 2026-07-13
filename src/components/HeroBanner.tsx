import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Props = {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
    /** Per-page override. Falls back to NEXT_PUBLIC_HERO_BG_URL. Supports images and GIFs. */
    backgroundUrl?: string;
};

export function HeroBanner({
    eyebrow,
    title,
    subtitle,
    children,
    className,
    backgroundUrl,
}: Props) {
    const bg = backgroundUrl ?? siteConfig.heroBackgroundUrl;

    return (
        <section
            className={cn(
                /* 🛠️ HEIGHT ADJUSTED: Reduced vertical padding from py-16/sm:py-20 to py-10 sm:py-12 for a slimmer layout */
                "relative overflow-hidden bg-forest px-4 py-10 sm:px-6 sm:py-12",
                className,
            )}
        >
            {bg && (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={bg}
                        alt=""
                        aria-hidden
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-forest/75" />
                </>
            )}

            {/* 🛠️ GRID REMOVED: Completely stripped out the fallback block that was generating the linear-gradient grid lines */}

            <div className="relative mx-auto max-w-6xl">
                {eyebrow && (
                    <p className="mb-2 text-xs font-base uppercase tracking-[0.2em] text-cream/60">
                        {eyebrow}
                    </p>
                )}
                <h1 className="font-display text-3xl font-bold text-cream sm:text-4xl md:text-5xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-cream/80">
                        {subtitle}
                    </p>
                )}
                {children && (
                    <div className="mt-6 flex flex-wrap gap-4">{children}</div>
                )}
            </div>
        </section>
    );
}