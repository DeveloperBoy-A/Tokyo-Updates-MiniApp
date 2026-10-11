import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

type RouteContext = { params: Promise<{ id: string }> };
function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 500 });
}
function validId(value: string) { return /^[0-9]+$/.test(value) && Number(value) > 0; }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200); }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ error: "Invalid blog post ID." }, { status: 400 });
    const { data, error } = await createSupabaseAdminClient().from("blog_posts").select("*").eq("id", Number(id)).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    return NextResponse.json({ post: data });
  } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ error: "Invalid blog post ID." }, { status: 400 });
    const body = await request.json();
    const update: Record<string, unknown> = {};
    for (const key of ["title", "slug", "excerpt", "content", "cover_image", "status"]) {
      if (Object.prototype.hasOwnProperty.call(body, key)) update[key] = body[key];
    }
    if (typeof update.title === "string") update.title = update.title.trim().slice(0, 200);
    if (typeof update.slug === "string") update.slug = slugify(update.slug);
    if (typeof update.excerpt === "string") update.excerpt = update.excerpt.slice(0, 500);
    if (typeof update.content === "string") update.content = update.content.slice(0, 100000);
    if (update.status !== undefined) {
      if (!["draft", "published", "archived"].includes(String(update.status))) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      update.published_at = update.status === "published" ? new Date().toISOString() : null;
    }
    if (!Object.keys(update).length) return NextResponse.json({ error: "No editable fields supplied." }, { status: 400 });
    const { data, error } = await createSupabaseAdminClient().from("blog_posts").update(update).eq("id", Number(id)).select("*").maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    return NextResponse.json({ post: data });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    if (!validId(id)) return NextResponse.json({ error: "Invalid blog post ID." }, { status: 400 });
    const { data, error } = await createSupabaseAdminClient().from("blog_posts").delete().eq("id", Number(id)).select("id").maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) { return errorResponse(error); }
}
