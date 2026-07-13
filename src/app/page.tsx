import { HeroCarousel } from "@/components/HeroCarousel";
import { getBookCount } from "@/lib/queries";

// Keep this if you want the page to always fetch the freshest database count on request
export const dynamic = "force-dynamic";

export default async function HomePage() {
    // Fetch the real book metrics safely
    const bookCount = await getBookCount();

    return (
        <>
            {/* Main Application Content */}
            <HeroCarousel />
        </>
    );
}