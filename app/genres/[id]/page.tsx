import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieGrid from "@/components/MovieGrid";
import Pagination from "@/components/Pagination";
import { discoverMedia, getGenres } from "@/lib/tmdb";

type Props = { params: { id: string }; searchParams: { page?: string } };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try { const genres = await getGenres("movie"); const genre = genres.find((item) => String(item.id) === params.id); return { title: genre ? `${genre.name} Movies` : "Movie genre", description: genre ? `Browse ${genre.name.toLowerCase()} movies.` : "Browse movies by genre." }; }
  catch { return { title: "Movie genre" }; }
}
export default async function GenrePage({ params, searchParams }: Props) {
  if (!/^\d+$/.test(params.id)) notFound();
  const [genres, data] = await Promise.all([getGenres("movie").catch(() => []), discoverMedia("movie", { genre: Number(params.id), page: Math.max(1, Math.min(500, Number.parseInt(searchParams.page ?? "1", 10) || 1)) }).catch(() => ({ page: 1, results: [], total_pages: 0, total_results: 0 }))]);
  const genre = genres.find((item) => String(item.id) === params.id);
  if (!genre) notFound();
  const page = Math.max(1, Math.min(500, Number.parseInt(searchParams.page ?? "1", 10) || 1));
  return <main className="py-4"><div className="mb-6"><p className="mb-1 text-sm uppercase tracking-widest text-neon-pink">Browse by genre</p><h1 className="text-2xl md:text-3xl font-bold">{genre.name} Movies</h1><p className="mt-2 text-sm text-neutral-400">{data.total_results.toLocaleString()} movies</p></div>{data.results.length ? <MovieGrid movies={data.results} /> : <p className="rounded-xl border border-neutral-800 p-8 text-neutral-400">No movies found in this genre.</p>}<Pagination current={page} total={Math.min(500, data.total_pages || 1)} /></main>;
}
