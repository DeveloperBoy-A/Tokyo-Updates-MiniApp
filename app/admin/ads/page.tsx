"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Save, RotateCcw } from "lucide-react";
import { DEFAULT_ADS_CONFIG, type AdsConfig, type AdZone } from "@/lib/ads";

const zones: { key: AdZone; label: string }[] = [
  { key: "banner", label: "Banner slot" },
  { key: "sidebar", label: "Sidebar slot" },
  { key: "interstitial", label: "Interstitial slot" },
  { key: "inArticle", label: "In-article slot" },
  { key: "leaderboard", label: "Leaderboard slot" }
];
const inputClass = "mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm outline-none focus:border-pink-500";

export default function AdminAdsPage() {
  const [config, setConfig] = useState<AdsConfig>(DEFAULT_ADS_CONFIG);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadConfig() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/ads", { cache: "no-store" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to load ad settings.");
      const value = result.config ?? result;
      setConfig({
        enabled: value.enabled === true,
        adsenseClient: typeof value.adsenseClient === "string" ? value.adsenseClient : DEFAULT_ADS_CONFIG.adsenseClient,
        slots: { ...DEFAULT_ADS_CONFIG.slots, ...(value.slots ?? {}) },
        interstitialFrequency: Number.isInteger(value.interstitialFrequency) ? Math.min(100, Math.max(1, value.interstitialFrequency)) : DEFAULT_ADS_CONFIG.interstitialFrequency
      });
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to load ad settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadConfig(); }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to save ad settings.");
      const saved = result.config ?? result;
      setConfig({ ...config, ...saved, slots: { ...config.slots, ...(saved.slots ?? {}) } });
      setMessage("Ad settings saved successfully.");
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to save ad settings.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-400">Monetization</p><h1 className="mt-2 text-3xl font-black">Ads settings</h1><p className="mt-2 text-sm text-neutral-400">Configure AdSense and ad placement slots.</p></div><button type="button" onClick={() => void loadConfig()} disabled={loading || busy} className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-3 text-sm font-semibold disabled:opacity-60"><RotateCcw size={16}/> Reload</button></div>
      {loading ? <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-400">Loading ad settings…</div> : <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7">
        <label className="flex items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4"><span><span className="block font-semibold">Enable ads</span><span className="mt-1 block text-xs text-neutral-500">Turn ad placements on or off globally.</span></span><input type="checkbox" checked={config.enabled} onChange={(e) => setConfig({ ...config, enabled: e.target.checked })} className="h-5 w-5 accent-pink-600"/></label>
        <label className="block text-sm font-semibold">AdSense client ID<input value={config.adsenseClient} onChange={(e) => setConfig({ ...config, adsenseClient: e.target.value.trim() })} className={inputClass} placeholder="ca-pub-…" /></label>
        <div className="grid gap-4 sm:grid-cols-2">{zones.map((zone) => <label key={zone.key} className="block text-sm font-semibold">{zone.label}<input value={config.slots[zone.key]} onChange={(e) => setConfig({ ...config, slots: { ...config.slots, [zone.key]: e.target.value.trim() } })} className={inputClass} placeholder="Ad slot ID" /></label>)}</div>
        <label className="block text-sm font-semibold">Interstitial frequency<input type="number" min={1} max={100} value={config.interstitialFrequency} onChange={(e) => setConfig({ ...config, interstitialFrequency: Math.min(100, Math.max(1, Number(e.target.value) || 1)) })} className={inputClass}/><span className="mt-1 block text-xs font-normal text-neutral-500">Show an interstitial after this many eligible views (1–100).</span></label>
        {error && <p role="alert" className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}
        {message && <p role="status" className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-300">{message}</p>}
        <div className="flex justify-end border-t border-neutral-800 pt-5"><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold disabled:opacity-60"><Save size={16}/>{busy ? "Saving…" : "Save settings"}</button></div>
      </form>}
    </div>
  );
}
