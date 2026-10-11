import { getTV, img } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import WatchlistButton from "@/components/WatchlistButton";
import RatingStars from "@/components/RatingStars";
export default async function TVDetail({ params }: { params: { id: string } }) {
  try {
    const m = await getTV(params.id);
    const trailer = m.videos?.results?.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube",
    );
    return (
      <div>
        <div className="relative h-[40vh] -mx-4 -mt-6 mb-6 overflow-hidden">
          <img
            src={img(m.backdrop_path, "original")}
            className="w-full h-full object-cover opacity-40"
            alt={m.name}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-6 -mt-40 relative z-10">
          <img
            src={img(m.poster_path)}
            className="w-40 md:w-56 rounded-lg"
            alt={m.name}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{m.name}</h1>
            <p className="mt-2 text-neutral-400">
              {m.first_air_date} • {m.number_of_seasons} seasons
            </p>
            <RatingStars value={m.vote_average} />
            <p className="mt-5 text-neutral-300">{m.overview}</p>
            <div className="mt-5">
              <WatchlistButton movie={{ ...m, title: m.name }} mediaType="tv" />
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
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
