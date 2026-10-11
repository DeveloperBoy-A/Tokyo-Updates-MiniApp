import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 500 });
}

export async function GET() {
  try {
    await requireAdmin();
    const client = createSupabaseAdminClient();
    const [movies, posts, links, profiles] = await Promise.all([
      client.from("movies").select("id", { count: "exact", head: true }),
      client.from("blog_posts").select("id", { count: "exact", head: true }),
      client.from("short_links").select("id,clicks,created_at", { count: "exact" }),
      client.from("profiles").select("id", { count: "exact", head: true })
    ]);
    const failure = [movies.error, posts.error, links.error, profiles.error].find(Boolean);
    if (failure) throw new Error(failure.message);
    const linkRows = links.data ?? [];
    const totalClicks = linkRows.reduce((sum, row) => sum + Math.max(0, Number(row.clicks) || 0), 0);
    const recentLinks = [...linkRows].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 10);
    return NextResponse.json({
      totals: { movies: movies.count ?? 0, blogPosts: posts.count ?? 0, shortLinks: links.count ?? 0, users: profiles.count ?? 0, clicks: totalClicks },
      recentLinks
    });
  } catch (error) { return errorResponse(error); }
}
