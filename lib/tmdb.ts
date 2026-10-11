import axios from "axios";
const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY!;
export const IMG_BASE = "https://image.tmdb.org/t/p";
export const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: API_KEY, language: "en-US" },
  timeout: 12000,
});
export const img = (path: string | null, size = "w500") =>
  path ? IMG_BASE + "/" + size + path : "/placeholder.svg";
export async function getTrending() {
  const { data } = await tmdb.get("/trending/movie/week");
  return data.results;
}
export async function getPopular() {
  const { data } = await tmdb.get("/movie/popular");
  return data.results;
}
export async function getTopRated() {
  const { data } = await tmdb.get("/movie/top_rated");
  return data.results;
}
export async function getUpcoming() {
  const { data } = await tmdb.get("/movie/upcoming");
  return data.results;
}
export async function getNowPlaying() {
  const { data } = await tmdb.get("/movie/now_playing");
  return data.results;
}
export async function getMovie(id: string) {
  const { data } = await tmdb.get("/movie/" + id, {
    params: {
      append_to_response: "credits,videos,watch/providers,recommendations",
    },
  });
  return data;
}
export async function getTV(id: string) {
  const { data } = await tmdb.get("/tv/" + id, {
    params: {
      append_to_response: "credits,videos,watch/providers,recommendations",
    },
  });
  return data;
}
export async function searchMovies(q: string, page = 1) {
  const { data } = await tmdb.get("/search/movie", {
    params: { query: q, page },
  });
  return data;
}
export async function discoverMovies(params: Record<string, string | number>) {
  const { data } = await tmdb.get("/discover/movie", { params });
  return data;
}
export async function discoverTV(params: Record<string, string | number>) {
  const { data } = await tmdb.get("/discover/tv", { params });
  return data;
}
export async function getGenres() {
  const { data } = await tmdb.get("/genre/movie/list");
  return data.genres;
}
