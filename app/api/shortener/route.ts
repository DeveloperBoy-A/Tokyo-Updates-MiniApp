import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getShortUrl, shortenUrl } from "@/lib/shortener";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 500 });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const originalUrl = typeof body.url === "string" ? body.url : typeof body.original_url === "string" ? body.original_url : "";
    if (!originalUrl.trim()) return NextResponse.json({ error: "A destination URL is required." }, { status: 400 });
    const hash = await shortenUrl(originalUrl);
    const shortUrl = getShortUrl(hash);
    return NextResponse.json({ success: true, hash, shortUrl, short_url: shortUrl }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
