import Link from "next/link";
import { redirect } from "next/navigation";
import { Film, Plus, Search } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
type MovieRecord = { id?: string | number; title?: string; name?: string; tmdb_id?: number; media_type?: string; release_date?: string; created_at?: string; status?: string };

export default async function AdminMoviesPage({ searchParams }: { searchParams?: { q?: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const query = (searchParams?.q ?? "").trim().slice(0, 100);
  let movies: MovieRecord[] = [];
  let loadError = "";
  try {
    const supabase = createSupabaseAdminClient();
    let request = supabase.from("movies").select("*").order("created_at", { ascending: false }).limit(100);
    if (query) request = request.ilike("title", `%${query.replace(/[%_]/g, "")}%`);
    const { data, error } = await request;
    if (error) loadError = error.message;
    else movies = (data ?? []) as MovieRecord[];
  } catch (error: unknown) {
    loadError = error instanceof Error ? error.message : "Unable to connect to the movie database.";
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-400">Content</p><h1 className="mt-2 text-3xl font-black">Movies catalogue</h1><p className="mt-2 text-sm text-neutral-400">Review records saved in your Supabase movies table.</p></div><Link href="/admin/movies/new" className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-bold hover:bg-pink-500"><Plus size={17} /> Add movie</Link></div>
      <form className="flex gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3" action="/admin/movies"><label className="flex min-w-0 flex-1 items-center gap-3"><Search size={18} className="text-neutral-500" /><input name="q" defaultValue={query} placeholder="Search by movie title…" className="w-full bg-transparent py-2 outline-none placeholder:text-neutral-600" /></label><button className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold hover:bg-neutral-800">Search</button></form>
      {loadError ? <div className="rounded-xl border border-amber-900 bg-amber-950/30 p-5"><h2 className="font-bold text-amber-200">Could not load movie records</h2><p className="mt-2 break-words text-sm text-amber-100/70">{loadError}</p><p className="mt-2 text-xs text-neutral-500">Check service-role credentials and confirm your database table/columns.</p></div> : <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"><div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4"><span className="font-semibold">Saved records</span><span className="text-xs text-neutral-500">{movies.length} loaded · up to 100</span></div>{movies.length ? <div className="divide-y divide-neutral-800">{movies.map((movie, index) => <div key={String(movie.id ?? movie.tmdb_id ?? index)} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-neutral-800 text-pink-400"><Film size={18} /></span><div className="min-w-0"><p className="truncate font-semibold">{movie.title ?? movie.name ?? "Untitled record"}</p><p className="mt-1 text-xs text-neutral-500">{movie.media_type ?? "movie"}{movie.release_date ? ` · ${movie.release_date}` : ""}{movie.tmdb_id ? ` · TMDB ${movie.tmdb_id}` : ""}</p></div></div><div className="text-xs text-neutral-400">{movie.status ?? ""}{movie.id !== undefined && <Link href={`/admin/movies/${encodeURIComponent(String(movie.id))}`} className="ml-3 rounded-lg border border-neutral-700 px-3 py-2 hover:border-pink-500">Manage</Link>}</div></div>)}</div> : <div className="p-10 text-center"><Film size={28} className="mx-auto text-neutral-600" /><p className="mt-3 font-semibold">No movie records found</p><p className="mt-1 text-sm text-neutral-500">{query ? "Try a different title." : "Add a movie record to get started."}</p><Link href="/admin/movies/new" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-pink-400"><Plus size={16} /> Add movie</Link></div>}</div>}
    </div>
  );
}
