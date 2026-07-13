import {
    boolean,
    integer,
    jsonb,
    numeric,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";


export const books = pgTable("books", {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 500 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    coverUrl: text("cover_url").notNull(),
    synopsis: text("synopsis").notNull(),
    hudsonReference: text("hudson_reference").notNull(),
    genre: text("genre").array(),
    pageCount: integer("page_count").notNull(),
    publishedYear: integer("published_year").notNull(),
    links: jsonb("links"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const reviews = pgTable("reviews", {
    id: uuid("id").defaultRandom().primaryKey(),
    bookId: uuid("book_id")
        .references(() => books.id, { onDelete: "cascade" })
        .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    twitter: varchar("twitter", { length: 100 }).notNull(),
    readingFormat: varchar("reading_format", { length: 50 }),
    rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
    reviewText: text("review_text"),
    editToken: varchar("edit_token", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const bookOfMonth = pgTable("botm", {
    id: uuid("id").defaultRandom().primaryKey(),
    bookId: uuid("book_id")
        .references(() => books.id, { onDelete: "cascade" })
        .notNull(),
    month: integer("month_label").notNull(),
    year: integer("year").notNull(),
    discordLink: text("club_url").notNull(),
    isActive: boolean("is_active").default(true),
});

export type Book = typeof books.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type BookOfMonth = typeof bookOfMonth.$inferSelect;
