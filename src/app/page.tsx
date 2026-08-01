import { HeroCarousel } from "@/components/HeroCarousel";

// Keep this if you want the page to always fetch the freshest database count on request
export const dynamic = "force-dynamic";

export default async function HomePage() {

    return (
        <>
            {/* Main Application Content */}
            <HeroCarousel />
        </>
    );
}