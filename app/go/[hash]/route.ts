import { NextResponse } from "next/server";
import { getShortLink, recordShortLinkClick } from "@/lib/shortener";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { hash: string } }) {
  const hash = params.hash;
  if (!/^[a-zA-Z0-9_-]{4,32}$/.test(hash)) {
    return NextResponse.redirect(new URL("/404", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), 302);
  }
  try {
    const link = await getShortLink(hash);
    if (!link || !link.enabled) {
      return NextResponse.redirect(new URL("/404", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), 302);
    }
    const destination = new URL(link.original_url);
    if (!["http:", "https:"].includes(destination.protocol) || destination.username || destination.password) {
      return NextResponse.json({ error: "This short link has an invalid destination." }, { status: 400 });
    }
    try { await recordShortLinkClick(hash); } catch (error) { console.error("Short-link click tracking failed:", error); }
    return NextResponse.redirect(destination, 302);
  } catch (error) {
    console.error("Short-link lookup failed:", error);
    return NextResponse.redirect(new URL("/404", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), 302);
  }
}
