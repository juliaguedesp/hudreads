import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { books, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, twitter, readingFormat, rating, reviewText, editToken } = body;

        const cleanReviewText = reviewText ? reviewText.replace(/&nbsp;/g, " ") : null;

        const [updatedReview] = await db
            .update(reviews)
            .set({
                name,
                twitter,
                readingFormat,
                rating: typeof rating === "number" ? rating.toFixed(1) : rating,
                reviewText: cleanReviewText,
                editToken: editToken,
            })
            .where(eq(reviews.id, id))
            .returning();

        if (updatedReview?.bookId) {
            const [book] = await db
                .select({ slug: books.slug })
                .from(books)
                .where(eq(books.id, updatedReview.bookId));

            if (book?.slug) {
                revalidatePath(`/books/${book.slug}`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}