import Link from "next/link";
import Image from "next/image";
import type { Book } from "@/db/schema";

type Props = {
    book: Book;
    showGenre?: boolean; // Unused, kept to prevent breaking imports elsewhere
};

export function BookCard({ book }: Props) {
    return (
        <Link
            href={`/books/${book.slug}`}
            className="group flex flex-col w-full overflow-hidden rounded-xl border border-forest/10 bg-white transition-all hover:border-forest/25 hover:shadow-md"
        >
            {/* Cover Container: Enforces a perfect 2:3 book ratio across all devices */}
            <div className="relative aspect-[2/3] w-full bg-beige-dark">
                {book.coverUrl ? (
                    <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-forest/30 text-xs">
                        No cover
                    </div>
                )}
            </div>

            {/* Text Container: Enhanced typography scaling for better mobile presence */}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="font-display text-lg sm:text-xl font-semibold leading-snug text-forest transition-opacity group-hover:opacity-70 line-clamp-2">
                    {book.title}
                </h3>
                <p className="mt-1 text-sm text-forest/60">{book.author}</p>
            </div>
        </Link>
    );
}