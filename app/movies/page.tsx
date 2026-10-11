import type { Metadata } from "next";
import MovieGrid from "@/components/MovieGrid";
import FilterPanel from "@/components/FilterPanel";
import Pagination from "@/components/Pagination";
import { discoverMedia, getGenres, searchMedia, type TmdbPage, type TmdbMediaSummary } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Discover Movies", description: "Browse popular movies, filter by genre and year, and discover your next favorite film." };

type SearchParams = { q?: string; genre?: string; year?: string; sort?: string; page?: string };

export default async function MoviesPage({ searchParams }: { searchParams: SearchParams }) {
  const q = (searchParams.q ?? "").trim().slice(0, 160);
  const genreValue = searchParams.genre ?? "";
  const yearValue = searchParams.year ?? "";
  const sort = searchParams.sort ?? "popularity.desc";
  const page = Math.max(1, Math.min(500, Number.parseInt(searchParams.page ?? "1", 10) || 1));
  const [genres, data] = await Promise.all([
    getGenres("movie").catch(() => []),
    q
      ? searchMedia(q, "movie", page).catch((): TmdbPage<TmdbMediaSummary> => ({ page, results: [], total_pages: 0, total_results: 0 }))
      : discoverMedia("movie", {
          page,
          genre: /^\d+$/.test(genreValue) ? Number(genreValue) : undefined,
          year: /^\d{4}$/.test(yearValue) ? Number(yearValue) : undefined,
          sortBy: ["popularity.desc", "vote_average.desc", "primary_release_date.desc", "revenue.desc"].includes(sort) ? sort : "popularity.desc"
        }).catch((): TmdbPage<TmdbMediaSummary> => ({ page, results: [], total_pages: 0, total_results: 0 }))
  ]);
  const total = Math.min(500, data.total_pages || 1);
  return (
    <main className="py-4">
      <div className="flex flex-col md:flex-row gap-6">
        <FilterPanel genres={genres} />
        <section className="min-w-0 flex-1">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-widest text-neon-pink mb-1">Explore the collection</p>
            <h1 className="text-2xl md:text-3xl font-bold">{q ? `Search results for “${q}”` : "Discover Movies"}</h1>
            <p className="text-sm text-neutral-400 mt-2">{data.total_results.toLocaleString()} titles found</p>
          </div>
          {data.results.length ? <MovieGrid movies={data.results} /> : <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-10 text-center"><h2 className="text-lg font-semibold">No movies found</h2><p className="text-neutral-400 mt-2">Try another title or adjust your filters.</p></div>}
          <Pagination current={page} total={total} />
        </section>
      </div>
    </main>
  );
}
