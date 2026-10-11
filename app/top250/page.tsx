import type { Metadata } from "next";
import MovieGrid from "@/components/MovieGrid";
import Pagination from "@/components/Pagination";
import { getTopRated } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Top Rated Movies", description: "Explore top-rated movies ranked by TMDB audience scores." };
export default async function Top250Page({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, Math.min(500, Number.parseInt(searchParams.page ?? "1", 10) || 1));
  const data = await getTopRated("movie", page).catch(() => ({ page, results: [], total_pages: 0, total_results: 0 }));
  return <main className="py-4"><header className="mb-7"><p className="mb-1 text-sm uppercase tracking-widest text-neon-pink">Audience favorites</p><h1 className="text-3xl font-extrabold">Top Rated Movies</h1><p className="mt-2 max-w-2xl text-neutral-400">Discover acclaimed films and audience favorites. Rankings and ratings are supplied by TMDB and can change over time.</p></header>{data.results.length ? <MovieGrid movies={data.results} /> : <p className="rounded-xl border border-neutral-800 p-8 text-neutral-400">Top-rated movies are temporarily unavailable.</p>}<Pagination current={page} total={Math.min(500, data.total_pages || 1)} /></main>;
}
