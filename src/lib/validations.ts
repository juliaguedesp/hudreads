import { z } from "zod";

export const reviewSchema = z.object({
    bookId: z.string().uuid(),
    name: z.string().min(1, "Name is required").max(100),
    twitter: z
        .string()
        .optional()
        .transform((val) => (val ? val.replace(/^@/, "").trim() : "")),
    readingFormat: z
        .enum(["physical", "paperback", "hardcover", "ebook", "audiobook"])
        .optional()
        .nullable(),
    rating: z
        .number()
        .min(0.5)
        .max(5)
        .refine((v) => (v * 2) % 1 === 0, "Rating must use half-star increments"),
    reviewText: z.string().max(5000).optional().nullable(),
});

export const reviewUpdateSchema = reviewSchema
    .omit({ bookId: true })
    .partial()
    .extend({
        editToken: z.string().min(1),
    });

export const adminLoginSchema = z.object({
    password: z.string().min(1),
});

export const READING_FORMAT_LABELS: Record<string, string> = {
    physical: "Physical",
    ebook: "Ebook",
    audiobook: "Audiobook",
};
