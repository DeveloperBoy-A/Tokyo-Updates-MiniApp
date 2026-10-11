import { discoverMovies, getGenres } from "@/lib/tmdb";
import MovieGrid from "@/components/MovieGrid";
import { notFound } from "next/navigation";
export default async function GenrePage({
  params,
}: {
  params: { id: string };
}) {
  const genres = await getGenres();
  const genre = genres.find((g: any) => String(g.id) === params.id);
  if (!genre) return notFound();
  const data = await discoverMovies({
    with_genres: params.id,
    sort_by: "popularity.desc",
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{genre.name} Movies</h1>
      <MovieGrid movies={data.results} />
    </div>
  );
}
