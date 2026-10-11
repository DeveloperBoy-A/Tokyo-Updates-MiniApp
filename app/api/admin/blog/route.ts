import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 500 });
}
function makeSlug(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200); }

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit") || 25)));
    const { data, error, count } = await createSupabaseAdminClient().from("blog_posts").select("*", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
    if (error) throw new Error(error.message);
    return NextResponse.json({ posts: data ?? [], results: data ?? [], total: count ?? 0, page, limit });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!title || title.length > 200 || !content) return NextResponse.json({ error: "Title and content are required; title must be 200 characters or fewer." }, { status: 400 });
    const slug = makeSlug(typeof body.slug === "string" && body.slug.trim() ? body.slug : title);
    if (!slug) return NextResponse.json({ error: "A valid URL slug is required." }, { status: 400 });
    const status = body.status === "published" ? "published" : "draft";
    const { data, error } = await createSupabaseAdminClient().from("blog_posts").insert({
      title, slug, excerpt: typeof body.excerpt === "string" ? body.excerpt.slice(0, 500) : null,
      content: content.slice(0, 100000), cover_image: typeof body.cover_image === "string" ? body.cover_image : null,
      status, published_at: status === "published" ? new Date().toISOString() : null
    }).select("*").single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ post: data }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
