import MovieCard from "./MovieCard";
export default function MovieGrid({
  movies,
  mediaType = "movie",
}: {
  movies: any[];
  mediaType?: "movie" | "tv";
}) {
  if (!movies?.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
      {movies.map((m) => (
        <MovieCard key={mediaType + m.id} movie={m} mediaType={mediaType} />
      ))}
    </div>
  );
}
