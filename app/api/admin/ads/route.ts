import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdsConfig, saveAdsConfig } from "@/lib/ads";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 500 });
}

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ config: await getAdsConfig() });
  } catch (error) { return errorResponse(error); }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) return NextResponse.json({ error: "A valid ads configuration object is required." }, { status: 400 });
    const config = await saveAdsConfig({
      enabled: body.enabled === true,
      adsenseClient: typeof body.adsenseClient === "string" ? body.adsenseClient.trim().slice(0, 100) : "",
      slots: {
        banner: typeof body.slots?.banner === "string" ? body.slots.banner.trim().slice(0, 100) : "",
        sidebar: typeof body.slots?.sidebar === "string" ? body.slots.sidebar.trim().slice(0, 100) : "",
        interstitial: typeof body.slots?.interstitial === "string" ? body.slots.interstitial.trim().slice(0, 100) : "",
        inArticle: typeof body.slots?.inArticle === "string" ? body.slots.inArticle.trim().slice(0, 100) : "",
        leaderboard: typeof body.slots?.leaderboard === "string" ? body.slots.leaderboard.trim().slice(0, 100) : ""
      },
      interstitialFrequency: Number.isInteger(body.interstitialFrequency) ? Math.min(100, Math.max(1, body.interstitialFrequency)) : 5
    });
    return NextResponse.json({ success: true, config });
  } catch (error) { return errorResponse(error); }
}
