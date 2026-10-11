"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Film, Save } from "lucide-react";

export default function NewAdminMoviePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tmdbId, setTmdbId] = useState("");
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [releaseDate, setReleaseDate] = useState("");
  const [overview, setOverview] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [status, setStatus] = useState("published");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const cleanTitle = title.trim();
    if (!cleanTitle) { setError("Movie title is required."); return; }
    const parsedId = tmdbId.trim() ? Number(tmdbId) : null;
    if (parsedId !== null && (!Number.isInteger(parsedId) || parsedId <= 0)) { setError("TMDB ID must be a positive number."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          tmdb_id: parsedId,
          media_type: mediaType,
          release_date: releaseDate || null,
          overview: overview.trim() || null,
          poster_path: posterPath.trim() || null,
          status
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to save movie record.");
      router.push("/admin/movies");
      router.refresh();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to save movie. Check the admin API and database configuration.");
    } finally { setBusy(false); }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm outline-none transition focus:border-pink-500";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/movies" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"><ArrowLeft size={16} /> Back to catalogue</Link>
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-400">Catalogue</p><h1 className="mt-2 text-3xl font-black">Add movie / series</h1><p className="mt-2 text-sm leading-6 text-neutral-400">Create a catalogue record using the protected admin API.</p></div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-pink-600/15 text-pink-400"><Film size={21} /></span><div><p className="font-bold">Title details</p><p className="text-xs text-neutral-500">Fields with * are required</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold sm:col-span-2">Title *<input required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} placeholder="e.g. Stranger Things" /></label>
          <label className="block text-sm font-semibold">Media type<select value={mediaType} onChange={(event) => setMediaType(event.target.value as "movie" | "tv")} className={inputClass}><option value="movie">Movie</option><option value="tv">TV series</option></select></label>
          <label className="block text-sm font-semibold">TMDB ID<input inputMode="numeric" value={tmdbId} onChange={(event) => setTmdbId(event.target.value)} className={inputClass} placeholder="Optional numeric ID" /></label>
          <label className="block text-sm font-semibold">Release / first air date<input type="date" value={releaseDate} onChange={(event) => setReleaseDate(event.target.value)} className={inputClass} /></label>
          <label className="block text-sm font-semibold">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
          <label className="block text-sm font-semibold sm:col-span-2">Poster path<input value={posterPath} onChange={(event) => setPosterPath(event.target.value)} className={inputClass} placeholder="/poster-path.jpg (optional TMDB path)" /></label>
          <label className="block text-sm font-semibold sm:col-span-2">Overview<textarea rows={5} maxLength={5000} value={overview} onChange={(event) => setOverview(event.target.value)} className={inputClass} placeholder="Short synopsis…" /></label>
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-neutral-800 pt-5"><Link href="/admin/movies" className="rounded-xl border border-neutral-700 px-4 py-3 text-sm font-semibold hover:bg-neutral-800">Cancel</Link><button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold hover:bg-pink-500 disabled:opacity-60"><Save size={16} />{busy ? "Saving…" : "Save record"}</button></div>
      </form>
    </div>
  );
}