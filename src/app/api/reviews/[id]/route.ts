import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { name, twitter, readingFormat, rating, reviewText, editToken } = body;

        const cleanReviewText = reviewText ? reviewText.replace(/&nbsp;/g, " ") : null;

        await db
            .update(reviews)
            .set({
                name,
                twitter,
                readingFormat,
                rating,
                reviewText: cleanReviewText,
                editToken: editToken, // ✨ Garante que o token existente continue associado
            })
            .where(eq(reviews.id, params.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}