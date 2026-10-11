"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

type Movie = { id: string | number; title: string; tmdb_id?: number | null; media_type?: string; release_date?: string | null; overview?: string | null; poster_path?: string | null; status?: string };

export default function EditAdminMoviePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/admin/movies/" + encodeURIComponent(params.id), { cache: "no-store" })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load record."); return data.movie as Movie; })
      .then(data => { if (active) setMovie(data); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load movie."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params.id]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!movie) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/movies/" + encodeURIComponent(params.id), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(movie) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not update movie.");
      router.push("/admin/movies"); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update movie."); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm("Delete this movie record? This cannot be undone.")) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/movies/" + encodeURIComponent(params.id), { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not delete movie.");
      router.push("/admin/movies"); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete movie."); }
    finally { setBusy(false); }
  }

  const field = "mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm outline-none focus:border-pink-500";
  if (loading) return <p className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-400">Loading movie record…</p>;
  if (!movie) return <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6"><h1 className="text-xl font-bold">Movie record unavailable</h1><p className="mt-2 text-sm text-red-300">{error || "No record was returned."}</p><Link href="/admin/movies" className="mt-4 inline-block text-sm text-pink-400">← Back to catalogue</Link></div>;
  return <div className="mx-auto max-w-3xl space-y-5"><Link href="/admin/movies" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"><ArrowLeft size={16}/> Back to catalogue</Link><div><p className="text-xs font-bold uppercase tracking-widest text-pink-400">Catalogue record</p><h1 className="mt-2 text-3xl font-black">Edit movie</h1><p className="mt-2 text-sm text-neutral-400">Record ID: {String(movie.id)}</p></div><form onSubmit={save} className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7"><label className="block text-sm font-semibold">Title<input required value={movie.title ?? ""} onChange={e=>setMovie({...movie,title:e.target.value})} className={field}/></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">TMDB ID<input type="number" min="1" value={movie.tmdb_id ?? ""} onChange={e=>setMovie({...movie,tmdb_id:e.target.value?Number(e.target.value):null})} className={field}/></label><label className="block text-sm font-semibold">Media type<select value={movie.media_type ?? "movie"} onChange={e=>setMovie({...movie,media_type:e.target.value})} className={field}><option value="movie">Movie</option><option value="tv">TV series</option></select></label><label className="block text-sm font-semibold">Release date<input type="date" value={movie.release_date ?? ""} onChange={e=>setMovie({...movie,release_date:e.target.value||null})} className={field}/></label><label className="block text-sm font-semibold">Status<select value={movie.status ?? "published"} onChange={e=>setMovie({...movie,status:e.target.value})} className={field}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label></div><label className="block text-sm font-semibold">Poster path<input value={movie.poster_path ?? ""} onChange={e=>setMovie({...movie,poster_path:e.target.value||null})} className={field}/></label><label className="block text-sm font-semibold">Overview<textarea rows={5} value={movie.overview ?? ""} onChange={e=>setMovie({...movie,overview:e.target.value||null})} className={field}/></label>{error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}<div className="flex flex-wrap justify-between gap-3 border-t border-neutral-800 pt-4"><button type="button" disabled={busy} onClick={remove} className="inline-flex items-center gap-2 rounded-xl border border-red-900 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-950/40 disabled:opacity-50"><Trash2 size={16}/> Delete record</button><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold hover:bg-pink-500 disabled:opacity-50"><Save size={16}/>{busy?"Saving…":"Save changes"}</button></div></form></div>;
}
