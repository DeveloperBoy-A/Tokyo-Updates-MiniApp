import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type AdZone = "banner" | "sidebar" | "interstitial" | "inArticle" | "leaderboard";

export interface AdsConfig {
  enabled: boolean;
  adsenseClient: string;
  slots: Record<AdZone, string>;
  interstitialFrequency: number;
}

export const DEFAULT_ADS_CONFIG: AdsConfig = {
  enabled: false,
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  slots: {
    banner: "",
    sidebar: "",
    interstitial: "",
    inArticle: "",
    leaderboard: ""
  },
  interstitialFrequency: 5
};

function getAdminSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function normalizeConfig(value: unknown): AdsConfig {
  if (typeof value !== "object" || value === null) {
    return DEFAULT_ADS_CONFIG;
  }

  const source = value as Partial<AdsConfig>;
  const slots = source.slots && typeof source.slots === "object" ? source.slots : {};

  return {
    enabled: source.enabled === true,
    adsenseClient:
      typeof source.adsenseClient === "string"
        ? source.adsenseClient
        : DEFAULT_ADS_CONFIG.adsenseClient,
    slots: {
      banner: typeof slots.banner === "string" ? slots.banner : "",
      sidebar: typeof slots.sidebar === "string" ? slots.sidebar : "",
      interstitial: typeof slots.interstitial === "string" ? slots.interstitial : "",
      inArticle: typeof slots.inArticle === "string" ? slots.inArticle : "",
      leaderboard: typeof slots.leaderboard === "string" ? slots.leaderboard : ""
    },
    interstitialFrequency:
      typeof source.interstitialFrequency === "number" &&
      Number.isInteger(source.interstitialFrequency)
        ? Math.min(100, Math.max(1, source.interstitialFrequency))
        : DEFAULT_ADS_CONFIG.interstitialFrequency
  };
}

export async function getAdsConfig(): Promise<AdsConfig> {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return DEFAULT_ADS_CONFIG;
  }

  try {
    const { data, error } = await supabase
      .from("ads_config")
      .select("value")
      .eq("key", "global")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_ADS_CONFIG;
    }
    return normalizeConfig(data.value);
  } catch {
    return DEFAULT_ADS_CONFIG;
  }
}

export async function saveAdsConfig(config: AdsConfig): Promise<AdsConfig> {
  const supabase = getAdminSupabase();
  if (!supabase) {
    throw new Error("Server-side Supabase credentials are not configured.");
  }

  const normalized = normalizeConfig(config);
  try {
    const { error } = await supabase.from("ads_config").upsert(
      {
        key: "global",
        value: normalized,
        updated_at: new Date().toISOString()
      },
      { onConflict: "key" }
    );

    if (error) {
      throw new Error(error.message);
    }
    return normalized;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? `Unable to save ad configuration: ${error.message}` : "Unable to save ad configuration."
    );
  }
}
