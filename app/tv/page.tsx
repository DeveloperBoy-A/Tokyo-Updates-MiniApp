import type { Metadata } from "next";
import MovieGrid from "@/components/MovieGrid";
import Pagination from "@/components/Pagination";
import { discoverMedia } from "@/lib/tmdb";

export const metadata: Metadata = { title: "TV Shows", description: "Explore trending and popular television series." };

export default async function TVPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, Math.min(500, Number.parseInt(searchParams.page ?? "1", 10) || 1));
  const data = await discoverMedia("tv", { page, sortBy: "popularity.desc" }).catch(() => ({ page, results: [], total_pages: 0, total_results: 0 }));
  return <main className="py-4"><div className="mb-6"><p className="mb-1 text-sm uppercase tracking-widest text-neon-pink">Binge-worthy picks</p><h1 className="text-2xl md:text-3xl font-bold">Popular TV Shows</h1><p className="mt-2 text-sm text-neutral-400">{data.total_results.toLocaleString()} shows to explore</p></div>{data.results.length ? <MovieGrid movies={data.results} mediaType="tv" /> : <p className="rounded-xl border border-neutral-800 p-8 text-neutral-400">TV shows could not be loaded right now. Please try again shortly.</p>}<Pagination current={page} total={Math.min(500, data.total_pages || 1)} /></main>;
}
