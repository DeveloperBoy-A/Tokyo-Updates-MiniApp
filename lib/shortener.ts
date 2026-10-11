import { createHash, randomBytes } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { safeExternalUrl } from "@/lib/utils";

export interface ShortLink {
  id: string;
  hash: string;
  original_url: string;
  clicks: number;
  enabled: boolean;
  created_at: string;
}

function getServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Server-side Supabase credentials are not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function createHashCode(url: string): string {
  const nonce = randomBytes(12).toString("hex");
  return createHash("sha256").update(url + ":" + nonce).digest("base64url").slice(0, 9);
}

export async function shortenUrl(originalUrl: string): Promise<string> {
  const validUrl = safeExternalUrl(originalUrl);
  if (!validUrl) throw new Error("Only valid HTTP or HTTPS URLs can be shortened.");
  if (validUrl.href.length > 4096) throw new Error("The original URL is too long.");

  try {
    const client = getServerClient();
    const hash = createHashCode(validUrl.href);
    const { error } = await client.from("short_links").insert({
      hash,
      original_url: validUrl.href,
      clicks: 0,
      enabled: true
    });
    if (error) throw new Error(error.message);
    return hash;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? "Unable to create short link: " + error.message : "Unable to create short link.");
  }
}

export async function getShortLink(hash: string): Promise<ShortLink | null> {
  if (!/^[a-zA-Z0-9_-]{4,32}$/.test(hash)) return null;
  try {
    const client = getServerClient();
    const { data, error } = await client
      .from("short_links")
      .select("id,hash,original_url,clicks,enabled,created_at")
      .eq("hash", hash)
      .eq("enabled", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as ShortLink | null;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? "Unable to find short link: " + error.message : "Unable to find short link.");
  }
}

export async function recordShortLinkClick(hash: string): Promise<void> {
  if (!/^[a-zA-Z0-9_-]{4,32}$/.test(hash)) throw new Error("Invalid short-link hash.");
  try {
    const client = getServerClient();
    const { data, error: readError } = await client
      .from("short_links")
      .select("clicks")
      .eq("hash", hash)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!data) throw new Error("Short link was not found.");

    const { error } = await client
      .from("short_links")
      .update({ clicks: Number(data.clicks ?? 0) + 1 })
      .eq("hash", hash);
    if (error) throw new Error(error.message);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? "Unable to record short-link click: " + error.message : "Unable to record short-link click.");
  }
}

export function getShortUrl(hash: string): string {
  if (!/^[a-zA-Z0-9_-]{4,32}$/.test(hash)) throw new Error("Invalid short-link hash.");
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL("/go/" + hash, base).toString();
}
