import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-bold text-forest">404</h1>
      <p className="mt-4 text-forest/70">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 bg-forest px-5 py-2.5 text-cream transition-opacity hover:opacity-90"
      >
        Back home
      </Link>
    </div>
  );
}
