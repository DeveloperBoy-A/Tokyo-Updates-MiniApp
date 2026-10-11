import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 500 });
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const client = createSupabaseAdminClient();
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit") || 25)));
    const { data, error, count } = await client.from("movies").select("*", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (error) throw new Error(error.message);
    return NextResponse.json({ movies: data ?? [], results: data ?? [], total: count ?? 0, page, limit });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title || title.length > 200) return NextResponse.json({ error: "A title of 1–200 characters is required." }, { status: 400 });
    const mediaType = body.media_type ?? body.mediaType ?? "movie";
    if (!["movie", "tv"].includes(mediaType)) return NextResponse.json({ error: "Media type must be movie or tv." }, { status: 400 });
    const record = {
      title,
      tmdb_id: body.tmdb_id || body.tmdbId ? Number(body.tmdb_id ?? body.tmdbId) : null,
      media_type: mediaType,
      release_date: body.release_date ?? body.releaseDate ?? null,
      poster_path: typeof body.poster_path === "string" ? body.poster_path : (typeof body.posterPath === "string" ? body.posterPath : null),
      overview: typeof body.overview === "string" ? body.overview.slice(0, 5000) : "",
      status: ["published", "draft", "archived"].includes(body.status) ? body.status : "published"
    };
    if (record.tmdb_id !== null && (!Number.isInteger(record.tmdb_id) || record.tmdb_id <= 0)) return NextResponse.json({ error: "TMDB ID must be a positive integer." }, { status: 400 });
    const client = createSupabaseAdminClient();
    const { data, error } = await client.from("movies").insert(record).select("*").single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ movie: data }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
