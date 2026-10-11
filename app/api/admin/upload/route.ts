import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ error: message }, { status: message.startsWith("Unauthorized") ? 401 : 500 });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const file = form.get("file");
    const destination = String(form.get("destination") || "general");
    if (!(file instanceof File)) return NextResponse.json({ error: "Select a file to upload." }, { status: 400 });
    if (file.size < 1 || file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "File must be between 1 byte and 10 MB." }, { status: 400 });
    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/mp4", "application/pdf"]);
    if (!allowed.has(file.type)) return NextResponse.json({ error: "Only JPEG, PNG, WebP, GIF, AVIF, MP4 and PDF files are supported." }, { status: 415 });
    const folders: Record<string, string> = { posters: "posters", blog: "blog", general: "general" };
    const folder = folders[destination] ?? "general";
    const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(-120) || "upload";
    const path = folder + "/" + Date.now() + "-" + crypto.randomUUID() + "-" + safeName;
    const client = createSupabaseAdminClient();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";
    const { error } = await client.storage.from(bucket).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
    const { data } = client.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ success: true, path, url: data.publicUrl }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}
