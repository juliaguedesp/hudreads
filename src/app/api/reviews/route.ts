import { db } from "@/db";
import { reviews } from "@/db/schema";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { reviewRatelimit } from "@/lib/ratelimit";
import { reviewSchema } from "@/lib/schemas/review";

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting Check
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
        const { success: rateLimitOk } = await reviewRatelimit.limit(ip);

        if (!rateLimitOk) {
            return NextResponse.json(
                { error: "Too many review submissions. Please wait an hour before posting again." },
                { status: 429 }
            );
        }

        // 2. Parse request body
        const body = await req.json();

        // 3. Zod Schema Validation
        const validation = reviewSchema.safeParse(body);

        if (!validation.success) {
            const firstError = validation.error.issues[0]?.message || "Invalid input data.";
            return NextResponse.json({ error: firstError }, { status: 400 });
        }

        const { bookId, name, twitter, readingFormat, rating, reviewText, turnstileToken } = validation.data;

        // 4. Turnstile Verification
        const secretKey = process.env.TURNSTILE_SECRET_KEY;
        if (!secretKey) {
            console.error("TURNSTILE_SECRET_KEY is not defined in environment variables.");
            return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
        }

        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                secret: secretKey,
                response: turnstileToken,
            }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            return NextResponse.json({ error: "Turnstile verification failed. Please try again." }, { status: 400 });
        }

        // 5. Clean review text & generate edit token
        const cleanReviewText = reviewText ? reviewText.replace(/&nbsp;/g, " ") : null;
        const generatedToken = crypto.randomUUID();

        // 6. Insert into Database
        const [newReview] = await db
            .insert(reviews)
            .values({
                bookId,
                name,
                twitter,
                readingFormat: readingFormat || null,
                rating: rating.toFixed(1), // 👈 Converts number (4.5) to string ("4.5") for Drizzle numeric column
                reviewText: cleanReviewText,
                editToken: generatedToken,
            })
            .returning();

        return NextResponse.json(newReview);
    } catch (error) {
        console.error("Review submission error:", error);
        return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
    }
}