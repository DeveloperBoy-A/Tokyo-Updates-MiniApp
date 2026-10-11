import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieRow from "@/components/MovieRow";
import RatingStars from "@/components/RatingStars";
import WatchlistButton from "@/components/WatchlistButton";
import { getMediaDetails, img, mediaYear } from "@/lib/tmdb";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const movie = await getMediaDetails(params.id, "movie");
    return { title: movie.title ?? "Movie details", description: movie.overview?.slice(0, 160), openGraph: { images: movie.poster_path ? [img(movie.poster_path, "w500")] : [] } };
  } catch { return { title: "Movie not found" }; }
}

export default async function MovieDetailPage({ params }: Props) {
  let movie;
  try { movie = await getMediaDetails(params.id, "movie"); } catch { notFound(); }
  const trailer = movie.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer") ?? movie.videos?.results?.find((video) => video.site === "YouTube");
  const providers = await (async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 86400 } });
      if (!response.ok) return null;
      const json = await response.json();
      return json.results?.IN ?? json.results?.US ?? null;
    } catch { return null; }
  })();
  return (
    <main className="space-y-10">
      <section className="relative isolate -mx-4 md:mx-0 overflow-hidden rounded-2xl min-h-[520px] bg-neutral-900">
        {movie.backdrop_path && <img src={img(movie.backdrop_path, "original")} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/30" />
        <div className="flex flex-col sm:flex-row gap-7 p-6 md:p-10">
          <img src={img(movie.poster_path, "w500")} alt={movie.title ?? "Movie poster"} className="w-40 md:w-64 self-start rounded-xl shadow-2xl" />
          <div className="max-w-3xl py-2">
            <p className="text-sm uppercase tracking-widest text-neon-pink">Movie details</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">{movie.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-300"><span>{mediaYear(movie) ?? "Release date TBA"}</span>{movie.runtime ? <span>{movie.runtime} min</span> : null}<span>{movie.status}</span><RatingStars value={movie.vote_average} /></div>
            {movie.tagline && <p className="mt-5 italic text-neutral-300">{movie.tagline}</p>}
            <p className="mt-4 leading-7 text-neutral-200">{movie.overview || "No synopsis is available for this title yet."}</p>
            <div className="mt-5 flex flex-wrap gap-2">{movie.genres?.map((genre) => <a key={genre.id} href={`/genres/${genre.id}`} className="rounded-full border border-neutral-700 px-3 py-1 text-xs hover:border-neon-pink">{genre.name}</a>)}</div>
            <div className="mt-6"><WatchlistButton movie={movie} /></div>
            {providers?.link && <p className="mt-5"><a href={providers.link} target="_blank" rel="noreferrer" className="text-neon-pink underline underline-offset-4">Check official streaming availability</a></p>}
          </div>
        </div>
      </section>
      {trailer && <section><h2 className="mb-4 text-xl font-bold">Official trailer</h2><div className="aspect-video max-w-4xl overflow-hidden rounded-xl border border-neutral-800"><iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}`} title={trailer.name || "Movie trailer"} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div></section>}
      {movie.credits?.cast?.length ? <section><h2 className="mb-4 text-xl font-bold">Top cast</h2><div className="flex gap-4 overflow-x-auto pb-3">{movie.credits.cast.slice(0, 12).map((person) => <div key={person.id} className="w-28 shrink-0"><img src={img(person.profile_path, "w185")} alt={person.name} className="aspect-[2/3] w-full rounded-lg object-cover bg-neutral-800" loading="lazy" /><p className="mt-2 text-sm font-semibold">{person.name}</p><p className="text-xs text-neutral-500">{person.character}</p></div>)}</div></section> : null}
      {movie.recommendations?.results?.length ? <MovieRow title="You May Also Like" movies={movie.recommendations.results} /> : null}
    </main>
  );
}
