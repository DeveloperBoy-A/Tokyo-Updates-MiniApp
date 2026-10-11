import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import { getPopular, getTopRated, getTrending, type TmdbMediaSummary } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Discover Movies & Series",
  description: "Explore trending titles, popular movies and top-rated entertainment on Tokyo_Updates."
};

export const revalidate = 3600;

function resultsOrEmpty(value: { results: TmdbMediaSummary[] } | null): TmdbMediaSummary[] {
  return value?.results ?? [];
}

export default async function HomePage() {
  let trending: TmdbMediaSummary[] = [];
  let popular: TmdbMediaSummary[] = [];
  let topRated: TmdbMediaSummary[] = [];
  let tvTrending: TmdbMediaSummary[] = [];

  try {
    const [trendingResponse, popularResponse, topRatedResponse, tvResponse] = await Promise.all([
      getTrending("all", "week"),
      getPopular("movie"),
      getTopRated("movie"),
      getTrending("tv", "week")
    ]);
    trending = resultsOrEmpty(trendingResponse);
    popular = resultsOrEmpty(popularResponse);
    topRated = resultsOrEmpty(topRatedResponse);
    tvTrending = resultsOrEmpty(tvResponse);
  } catch (error: unknown) {
    console.error("Unable to load homepage TMDB data:", error instanceof Error ? error.message : "Unknown error");
  }

  return (
    <div className="space-y-10">
      {trending.length > 0 ? (
        <HeroBanner movies={trending.slice(0, 5)} />
      ) : (
        <section className="hero-fallback">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-neon-pink">Tokyo_Updates</p>
          <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl">Your next favourite story starts here.</h1>
          <p className="mt-4 max-w-xl text-neutral-300">Discover films and series, explore ratings, and find official places to watch.</p>
          <a href="/movies" className="mt-6 inline-flex rounded-lg bg-neon-pink px-5 py-3 font-bold text-white transition hover:brightness-110">Explore movies</a>
        </section>
      )}
      <MovieRow title="🔥 Trending This Week" movies={trending} href="/movies" />
      <MovieRow title="⭐ Popular Movies" movies={popular} href="/movies" />
      <MovieRow title="📺 Trending Series" movies={tvTrending} href="/tv" mediaType="tv" />
      <MovieRow title="🏆 Top Rated Movies" movies={topRated} href="/top250" />
      {trending.length === 0 && popular.length === 0 && topRated.length === 0 && (
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-bold">Movie catalogue is temporarily unavailable</h2>
          <p className="mt-2 text-neutral-400">Please try again later. If you manage this site, check the TMDB_API_KEY environment variable.</p>
        </section>
      )}
    </div>
  );
}
