"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Link2 } from "lucide-react";

type CreatedLink = { hash: string; shortUrl: string; originalUrl: string };

const inputClass = "mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm outline-none focus:border-pink-500";

export default function AdminShortenerPage() {
  const [url, setUrl] = useState("");
  const [created, setCreated] = useState<CreatedLink[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/shortener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), original_url: url.trim() })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to create short link.");
      const hash = result.hash ?? result.link?.hash;
      if (typeof hash !== "string" || !hash) throw new Error("The API did not return a short-link hash.");
      const shortUrl = result.shortUrl ?? result.short_url ?? (typeof window !== "undefined" ? window.location.origin + "/go/" + hash : "/go/" + hash);
      setCreated((items) => [{ hash, shortUrl, originalUrl: url.trim() }, ...items]);
      setUrl("");
      setMessage("Short link created. This list is only for this open session.");
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to create short link.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied to clipboard.");
    } catch {
      setError("Clipboard access failed. Select and copy the URL manually.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-400">Tools</p><h1 className="mt-2 text-3xl font-black">URL shortener</h1><p className="mt-2 text-sm text-neutral-400">Create a short redirect link for a valid HTTP or HTTPS URL.</p></div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7">
        <label className="block text-sm font-semibold">Destination URL<input required type="url" maxLength={4096} value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} placeholder="https://example.com/page" /></label>
        {error && <p role="alert" className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}
        {message && <p role="status" className="rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-neutral-300">{message}</p>}
        <div className="flex justify-end"><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold disabled:opacity-60"><Link2 size={16}/>{busy ? "Creating…" : "Create short link"}</button></div>
      </form>
      <section className="space-y-3"><div><h2 className="text-xl font-bold">Created in this session</h2><p className="mt-1 text-sm text-neutral-500">Links are saved to the database; this list clears when you leave or refresh this page.</p></div>
        {created.length === 0 ? <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">No links created in this session yet.</div> : created.map((item) => <div key={item.hash} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4"><p className="break-all font-semibold text-pink-300">{item.shortUrl}</p><p className="mt-2 break-all text-xs text-neutral-500">{item.originalUrl}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => void copy(item.shortUrl)} className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-sm"><Copy size={14}/> Copy short URL</button><Link href={"/go/" + item.hash} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-sm"><ExternalLink size={14}/> Open redirect</Link></div></div>)}
      </section>
    </div>
  );
}
