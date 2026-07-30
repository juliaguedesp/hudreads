import { db } from "@/db";
import { reviews } from "@/db/schema";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
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

        // Limpa os espaços rígidos do HTML
        const cleanReviewText = reviewText ? reviewText.replace(/&nbsp;/g, " ") : null;

        // Gerar um token único obrigatório para essa review
        const generatedToken = crypto.randomUUID();

        // Passa o token gerado para satisfazer o esquema do Drizzle
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
        console.error(error);
        return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
    }
}