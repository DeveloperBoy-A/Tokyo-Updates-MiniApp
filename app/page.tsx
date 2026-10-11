import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  getNowPlaying,
} from "@/lib/tmdb";
import MovieRow from "@/components/MovieRow";
import HeroBanner from "@/components/HeroBanner";
export const revalidate = 3600;
export default async function Home() {
  const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all(
    [
      getTrending(),
      getPopular(),
      getTopRated(),
      getUpcoming(),
      getNowPlaying(),
    ],
  );
  return (
    <>
      <HeroBanner movies={trending.slice(0, 5)} />
      <MovieRow
        title="🔥 Trending This Week"
        movies={trending}
        href="/movies"
      />
      <MovieRow title="⭐ Popular Now" movies={popular} href="/movies" />
      <MovieRow title="🎥 Now Playing" movies={nowPlaying} href="/movies" />
      <MovieRow title="🏆 Top Rated" movies={topRated} href="/movies" />
      <MovieRow title="🎬 Coming Soon" movies={upcoming} href="/movies" />
    </>
  );
}
