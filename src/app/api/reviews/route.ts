import { db } from "@/db";
import { reviews } from "@/db/schema";
import { NextResponse } from "next/server";
import crypto from "crypto"; // 🌟 Importe o módulo nativo de criptografia

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { bookId, name, twitter, readingFormat, rating, reviewText } = body;

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
                editToken: generatedToken, // ✨ Adicionado aqui!
            })
            .returning();

        return NextResponse.json(newReview);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }
}