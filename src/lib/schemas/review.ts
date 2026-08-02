import { z } from "zod";

export const reviewSchema = z.object({
    bookId: z.string().uuid("Invalid book ID format"),
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    twitter: z
        .string()
        .trim()
        .max(100, "Twitter handle is too long")
        .optional()
        .or(z.literal("")),
    readingFormat: z.string().max(50).nullable().optional(),
    rating: z.coerce.number().min(0.5, "Rating must be at least 0.5").max(5, "Rating cannot exceed 5"),
    reviewText: z.string().nullable().optional(),
    turnstileToken: z.string().min(1, "Turnstile token is required"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;