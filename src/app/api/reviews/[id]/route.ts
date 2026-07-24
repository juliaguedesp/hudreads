import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
                editToken: editToken,
            })
            .where(eq(reviews.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}