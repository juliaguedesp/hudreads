import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { books, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// check if request originates from an Admin session
function checkIsAdmin(req: NextRequest): boolean {
    const adminHeader = req.headers.get("x-admin-auth");
    if (adminHeader === "true") return true;

    const adminCookie = req.cookies.get("admin_session")?.value;
    // Checks if cookie exists or equals "true"
    return Boolean(adminCookie && adminCookie !== "false");
}

// -------------------------------------------------------------
// PATCH: Update Review
// -------------------------------------------------------------
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, twitter, readingFormat, rating, reviewText, editToken } = body;

        // Extract token from body or custom header
        const headerToken = req.headers.get("x-edit-token");
        const effectiveToken = editToken || headerToken;

        // Fetch existing review to verify authorization
        const [existingReview] = await db
            .select()
            .from(reviews)
            .where(eq(reviews.id, id));

        if (!existingReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        const isAdmin = checkIsAdmin(req);
        const hasValidToken = Boolean(
            effectiveToken && existingReview.editToken === effectiveToken
        );

        if (!isAdmin && !hasValidToken) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid edit token" },
                { status: 401 }
            );
        }

        const cleanReviewText = reviewText
            ? reviewText.replace(/&nbsp;/g, " ")
            : null;
        const cleanTwitter = twitter ? twitter.replace(/^@/, "").trim() : "";

        const [updatedReview] = await db
            .update(reviews)
            .set({
                name,
                twitter: cleanTwitter,
                readingFormat,
                rating: typeof rating === "number" ? rating.toFixed(1) : rating,
                reviewText: cleanReviewText,
                // Preserve existing token if none was passed in payload
                editToken: effectiveToken ?? existingReview.editToken,
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

        return NextResponse.json({ success: true, data: updatedReview });
    } catch (error) {
        console.error("Update review error:", error);
        return NextResponse.json(
            { error: "Failed to update review" },
            { status: 500 }
        );
    }
}

// -------------------------------------------------------------
// DELETE: Delete Review
// -------------------------------------------------------------
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Extract editToken from header or body safely
        let editToken: string | null = req.headers.get("x-edit-token");

        if (!editToken) {
            try {
                const body = await req.json();
                editToken = body?.editToken ?? null;
            } catch {
                // Body might be empty
            }
        }

        // Fetch review first to verify token or admin status
        const [existingReview] = await db
            .select()
            .from(reviews)
            .where(eq(reviews.id, id));

        if (!existingReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        const isAdmin = checkIsAdmin(req);
        const hasValidToken = Boolean(
            editToken && existingReview.editToken === editToken
        );

        if (!isAdmin && !hasValidToken) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid edit token" },
                { status: 401 }
            );
        }

        // Delete from database
        const [deletedReview] = await db
            .delete(reviews)
            .where(eq(reviews.id, id))
            .returning();

        // Revalidate Next.js cache so the book page instantly updates
        if (deletedReview?.bookId) {
            const [book] = await db
                .select({ slug: books.slug })
                .from(books)
                .where(eq(books.id, deletedReview.bookId));

            if (book?.slug) {
                revalidatePath(`/books/${book.slug}`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete review error:", error);
        return NextResponse.json(
            { error: "Failed to delete review" },
            { status: 500 }
        );
    }
}