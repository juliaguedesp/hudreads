export const READ_BOOKS_KEY = "hudreads-read-books";
export const REVIEW_TOKENS_KEY = "hudreads-review-tokens";

export function getReadBookSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(READ_BOOKS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setReadBookSlugs(slugs: string[]) {
  localStorage.setItem(READ_BOOKS_KEY, JSON.stringify(slugs));
}

export function toggleReadBook(slug: string): boolean {
  const current = getReadBookSlugs();
  const isRead = current.includes(slug);
  const next = isRead
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  setReadBookSlugs(next);
  return !isRead;
}

export function isBookRead(slug: string): boolean {
  return getReadBookSlugs().includes(slug);
}

export function saveReviewToken(reviewId: string, token: string) {
  const tokens = getReviewTokens();
  tokens[reviewId] = token;
  localStorage.setItem(REVIEW_TOKENS_KEY, JSON.stringify(tokens));
}

export function getReviewToken(reviewId: string): string | null {
  return getReviewTokens()[reviewId] ?? null;
}

export function removeReviewToken(reviewId: string) {
  const tokens = getReviewTokens();
  delete tokens[reviewId];
  localStorage.setItem(REVIEW_TOKENS_KEY, JSON.stringify(tokens));
}

function getReviewTokens(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REVIEW_TOKENS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatMonthYear(month: number, year: number) {
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function averageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}
