import type { Metadata } from "next";
import { Courier_Prime, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const courierPrime = Courier_Prime({
    weight: ["400", "700"],
    variable: "--font-serif",
    subsets: ["latin"],
    style: ["normal", "italic"],
    display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
    weight: ["400", "600", "700"],
    variable: "--font-display",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: { default: "Hudreads", template: "%s" },
    description: "Every book Hudson Williams has ever recommended.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${courierPrime.variable} ${cormorantGaramond.variable} antialiased`}>
            <body className="flex min-h-screen flex-col bg-cream font-serif text-forest">
                <Header />
                <main className="flex-1 w-full">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}