import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });
  try {
    const data = await searchMovies(q);
    return NextResponse.json({ results: (data.results || []).slice(0, 8) });
  } catch {
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
