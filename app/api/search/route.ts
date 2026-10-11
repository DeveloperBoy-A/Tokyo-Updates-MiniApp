import { NextRequest, NextResponse } from "next/server";
import { searchMedia } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });
  if (query.length > 160) return NextResponse.json({ error: "Search query is too long.", results: [] }, { status: 400 });
  try {
    const data = await searchMedia(query, "multi");
    return NextResponse.json({ results: (data.results || []).slice(0, 8) });
  } catch {
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
