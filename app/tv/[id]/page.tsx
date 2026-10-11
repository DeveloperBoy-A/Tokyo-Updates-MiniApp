import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieRow from "@/components/MovieRow";
import RatingStars from "@/components/RatingStars";
import WatchlistButton from "@/components/WatchlistButton";
import { getMediaDetails, img, mediaYear } from "@/lib/tmdb";

type Props = { params: { id: string } };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try { const show = await getMediaDetails(params.id, "tv"); return { title: show.name ?? "TV show details", description: show.overview?.slice(0, 160), openGraph: { images: show.poster_path ? [img(show.poster_path, "w500")] : [] } }; }
  catch { return { title: "TV show not found" }; }
}
export default async function TVDetailPage({ params }: Props) {
  let show;
  try { show = await getMediaDetails(params.id, "tv"); } catch { notFound(); }
  const trailer = show.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer") ?? show.videos?.results?.find((video) => video.site === "YouTube");
  return <main className="space-y-10">
    <section className="relative isolate -mx-4 md:mx-0 overflow-hidden rounded-2xl min-h-[500px] bg-neutral-900">
      {show.backdrop_path && <img src={img(show.backdrop_path, "original")} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/30" />
      <div className="flex flex-col sm:flex-row gap-7 p-6 md:p-10">
        <img src={img(show.poster_path, "w500")} alt={show.name ?? "TV poster"} className="w-40 md:w-64 self-start rounded-xl shadow-2xl" />
        <div className="max-w-3xl py-2"><p className="text-sm uppercase tracking-widest text-neon-pink">TV series</p><h1 className="mt-2 text-3xl md:text-5xl font-extrabold">{show.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-300"><span>{mediaYear(show) ?? "Release date TBA"}</span>{show.number_of_seasons ? <span>{show.number_of_seasons} seasons</span> : null}{show.number_of_episodes ? <span>{show.number_of_episodes} episodes</span> : null}<RatingStars value={show.vote_average} /></div>
          {show.tagline && <p className="mt-5 italic text-neutral-300">{show.tagline}</p>}<p className="mt-4 leading-7 text-neutral-200">{show.overview || "No synopsis is available for this title yet."}</p>
          <div className="mt-5 flex flex-wrap gap-2">{show.genres?.map((genre) => <a key={genre.id} href={`/genres/${genre.id}`} className="rounded-full border border-neutral-700 px-3 py-1 text-xs hover:border-neon-pink">{genre.name}</a>)}</div><div className="mt-6"><WatchlistButton movie={{ ...show, title: show.name }} mediaType="tv" /></div>
        </div>
      </div>
    </section>
    {trailer && <section><h2 className="mb-4 text-xl font-bold">Official trailer</h2><div className="aspect-video max-w-4xl overflow-hidden rounded-xl border border-neutral-800"><iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}`} title={trailer.name || "TV show trailer"} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div></section>}
    {show.credits?.cast?.length ? <section><h2 className="mb-4 text-xl font-bold">Top cast</h2><div className="flex gap-4 overflow-x-auto pb-3">{show.credits.cast.slice(0, 12).map((person) => <div key={person.id} className="w-28 shrink-0"><img src={img(person.profile_path, "w185")} alt={person.name} className="aspect-[2/3] w-full rounded-lg object-cover bg-neutral-800" loading="lazy" /><p className="mt-2 text-sm font-semibold">{person.name}</p><p className="text-xs text-neutral-500">{person.character}</p></div>)}</div></section> : null}
    {show.recommendations?.results?.length ? <MovieRow title="Similar TV Shows" movies={show.recommendations.results} mediaType="tv" /> : null}
  </main>;
}
