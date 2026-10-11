import { getMovie, img } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import WatchlistButton from "@/components/WatchlistButton";
import RatingStars from "@/components/RatingStars";
import MovieRow from "@/components/MovieRow";
export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const m = await getMovie(params.id);
    return {
      title: m.title,
      description: m.overview?.slice(0, 160),
      openGraph: { images: [img(m.poster_path, "w500")] },
    };
  } catch {
    return { title: "Movie" };
  }
}
export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const m = await getMovie(params.id);
    const trailer = m.videos?.results?.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube",
    );
    const providers =
      m["watch/providers"]?.results?.IN || m["watch/providers"]?.results?.US;
    return (
      <div>
        <div className="relative h-[40vh] -mx-4 -mt-6 mb-6 overflow-hidden">
          <img
            src={img(m.backdrop_path, "original")}
            className="w-full h-full object-cover opacity-40"
            alt={m.title}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-6 -mt-40 relative z-10">
          <img
            src={img(m.poster_path)}
            className="w-40 md:w-56 rounded-lg"
            alt={m.title}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{m.title}</h1>
            <div className="flex gap-3 mt-2 text-neutral-400 text-sm">
              <span>{m.release_date}</span>
              <span>{m.runtime} min</span>
              <RatingStars value={m.vote_average} />
            </div>
            <p className="mt-5 text-neutral-300">{m.overview}</p>
            <div className="mt-5">
              <WatchlistButton movie={m} />
            </div>
            {trailer && (
              <div className="mt-6 aspect-video max-w-2xl">
                <iframe
                  src={"https://www.youtube.com/embed/" + trailer.key}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title="Trailer"
                />
              </div>
            )}
            {providers && (
              <div className="mt-6">
                <h3 className="font-bold mb-3">Where to Watch (Legal)</h3>
                <a
                  href={providers.link}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-neon-pink"
                >
                  View official providers
                </a>
              </div>
            )}
          </div>
        </div>
        {m.recommendations?.results?.length > 0 && (
          <MovieRow
            title="You May Also Like"
            movies={m.recommendations.results}
          />
        )}
      </div>
    );
  } catch {
    notFound();
  }
}
