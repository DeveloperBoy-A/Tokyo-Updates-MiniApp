import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

type RouteContext = { params: Promise<{ id: string }> };
function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 500 });
}
function validId(value: string) { return /^[a-zA-Z0-9_-]{1,128}$/.test(value); }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ error: "Invalid movie ID." }, { status: 400 });
    const { data, error } = await createSupabaseAdminClient().from("movies").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    return NextResponse.json({ movie: data });
  } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ error: "Invalid movie ID." }, { status: 400 });
    const body = await request.json();
    const allowed: Record<string, unknown> = {};
    const aliases: Record<string, string> = { mediaType: "media_type", releaseDate: "release_date", posterPath: "poster_path", tmdbId: "tmdb_id" };
    for (const key of ["title", "tmdb_id", "media_type", "release_date", "poster_path", "overview", "status", "genres", "backdrop_path", "vote_average"]) {
      if (Object.prototype.hasOwnProperty.call(body, key)) allowed[key] = body[key];
    }
    for (const [alias, key] of Object.entries(aliases)) if (Object.prototype.hasOwnProperty.call(body, alias) && !Object.prototype.hasOwnProperty.call(allowed, key)) allowed[key] = body[alias];
    if (typeof allowed.title === "string") allowed.title = allowed.title.trim().slice(0, 200);
    if (typeof allowed.overview === "string") allowed.overview = allowed.overview.slice(0, 5000);
    if (allowed.media_type !== undefined && !["movie", "tv"].includes(String(allowed.media_type))) return NextResponse.json({ error: "Media type must be movie or tv." }, { status: 400 });
    if (allowed.status !== undefined && !["published", "draft", "archived"].includes(String(allowed.status))) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    if (!Object.keys(allowed).length) return NextResponse.json({ error: "No editable fields supplied." }, { status: 400 });
    const { data, error } = await createSupabaseAdminClient().from("movies").update(allowed).eq("id", Number(id)).select("*").maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    return NextResponse.json({ movie: data });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ error: "Invalid movie ID." }, { status: 400 });
    const { data, error } = await createSupabaseAdminClient().from("movies").delete().eq("id", Number(id)).select("id").maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Movie not found." }, { status: 404 });
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) { return errorResponse(error); }
}
