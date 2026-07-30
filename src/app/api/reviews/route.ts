import { db } from "@/db";
import { reviews } from "@/db/schema";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { reviewRatelimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
    try {
        // 1. Get Client IP Address (Vercel provides this in the header)
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

        // 2. Check Rate Limit
        const { success } = await reviewRatelimit.limit(ip);

        if (!success) {
            return NextResponse.json(
                { error: "Too many review submissions. Please wait an hour before posting again." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { bookId, name, twitter, readingFormat, rating, reviewText, turnstileToken } = body;

        // 🛡️ Ensure Turnstile token is present
        if (!turnstileToken) {
            return NextResponse.json({ error: "Missing Turnstile token." }, { status: 400 });
        }

        // 🛡️ Validate Turnstile token with Cloudflare's API
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

        // Clean HTML non-breaking spaces
        const cleanReviewText = reviewText ? reviewText.replace(/&nbsp;/g, " ") : null;

        // Generate unique token
        const generatedToken = crypto.randomUUID();

        // Insert into database
        const [newReview] = await db
            .insert(reviews)
            .values({
                bookId,
                name,
                twitter,
                readingFormat,
                rating,
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