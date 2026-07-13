import { NextResponse } from "next/server";
import { getAllBooks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allBooks = await getAllBooks();
    return NextResponse.json(allBooks);
  } catch {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }
}
