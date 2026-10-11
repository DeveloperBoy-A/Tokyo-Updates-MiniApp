import type { Metadata } from "next";
import Link from "next/link";
import MovieGrid from "@/components/MovieGrid";
import Pagination from "@/components/Pagination";
import { mediaTitle, searchMedia } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Search", description: "Search movies and TV shows on Tokyo Updates." };
export default async function SearchPage({ searchParams }: { searchParams: { q?: string; page?: string; type?: string } }) {
  const q = (searchParams.q ?? "").trim().slice(0, 160);
  const page = Math.max(1, Math.min(500, Number.parseInt(searchParams.page ?? "1", 10) || 1));
  const type = searchParams.type === "movie" || searchParams.type === "tv" ? searchParams.type : "multi";
  const data = q ? await searchMedia(q, type, page).catch(() => ({ page, results: [], total_pages: 0, total_results: 0 })) : { page: 1, results: [], total_pages: 0, total_results: 0 };
  const movies = data.results.filter((item) => item.media_type !== "person");
  const movieItems = movies.filter((item) => (item.media_type ?? type) !== "tv");
  const tvItems = movies.filter((item) => item.media_type === "tv");
  const normalizedMovies = type === "tv" ? movies : movieItems;
  const normalizedTV = type === "movie" ? [] : tvItems;
  return <main className="py-4"><div className="mb-6"><p className="mb-1 text-sm uppercase tracking-widest text-neon-pink">Find your next watch</p><h1 className="text-2xl md:text-3xl font-bold">Search</h1><form action="/search" className="mt-5 flex max-w-2xl gap-2"><input name="q" defaultValue={q} placeholder="Search movies and TV shows..." className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none focus:border-neon-pink" /><button className="rounded-lg bg-neon-pink px-5 py-3 font-semibold text-white">Search</button></form><div className="mt-4 flex flex-wrap gap-2 text-sm"><Link href={`/search?q=${encodeURIComponent(q)}&type=multi`} className="rounded-full border border-neutral-700 px-3 py-1 hover:border-neon-pink">All</Link><Link href={`/search?q=${encodeURIComponent(q)}&type=movie`} className="rounded-full border border-neutral-700 px-3 py-1 hover:border-neon-pink">Movies</Link><Link href={`/search?q=${encodeURIComponent(q)}&type=tv`} className="rounded-full border border-neutral-700 px-3 py-1 hover:border-neon-pink">TV Shows</Link></div></div>
    {!q ? <p className="rounded-xl border border-neutral-800 p-8 text-neutral-400">Enter a title above to search the catalog.</p> : !movies.length ? <p className="rounded-xl border border-neutral-800 p-8 text-neutral-400">No results found for “{q}”. Try a different title.</p> : <><p className="mb-5 text-sm text-neutral-400">{data.total_results.toLocaleString()} results for “{q}”</p>{normalizedMovies.length > 0 && <section className="mb-10"><h2 className="mb-4 text-xl font-bold">Movies</h2><MovieGrid movies={normalizedMovies} mediaType="movie" /></section>}{normalizedTV.length > 0 && <section className="mb-10"><h2 className="mb-4 text-xl font-bold">TV Shows</h2><MovieGrid movies={normalizedTV} mediaType="tv" /></section>}<Pagination current={page} total={Math.min(500, data.total_pages || 1)} /></>}
  </main>;
}
