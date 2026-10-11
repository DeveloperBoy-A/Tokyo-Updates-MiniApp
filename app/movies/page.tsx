import { searchMovies, discoverMovies, getGenres } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";
import FilterPanel from "@/components/FilterPanel";
import Pagination from "@/components/Pagination";
export default async function MoviesPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    genre?: string;
    year?: string;
    sort?: string;
    page?: string;
  };
}) {
  const { q, genre, year, sort = "popularity.desc", page = "1" } = searchParams;
  const genres = await getGenres();
  let data;
  if (q) data = await searchMovies(q, Number(page));
  else {
    const p: Record<string, string | number> = { page, sort_by: sort };
    if (genre) p.with_genres = genre;
    if (year) p.primary_release_year = year;
    data = await discoverMovies(p);
  }
  const total = Math.min(data.total_pages || 1, 500);
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <FilterPanel genres={genres} />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">
          {q ? "Results for " + q : "Discover Movies"}
        </h1>
        {data.results?.length ? (
          <>
            <MovieGrid movies={data.results} />
            <Pagination current={Number(page)} total={total} />
          </>
        ) : (
          <p className="text-neutral-400">No results found.</p>
        )}
      </div>
    </div>
  );
}
