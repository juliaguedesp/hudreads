import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images-na.ssl-images-amazon.com",
            },
            {
                protocol: "https",
                hostname: "**.supabase.co",
            },
            {
                protocol: "https",
                hostname: "m.media-amazon.com",
            },
        ],
    },
    experimental: {
        /* Uses native compilation cache settings to bypass 
           the hidden .vs editor locking bottlenecks cleanly without invalidating types */
        turbopackFileSystemCacheForDev: true,
    },
};

export default nextConfig;