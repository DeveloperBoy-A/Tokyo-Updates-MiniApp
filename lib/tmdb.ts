import axios, { type AxiosError } from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type MediaKind = "movie" | "tv";

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbImageCollection {
  poster_path: string | null;
  backdrop_path: string | null;
  profile_path?: string | null;
}

export interface TmdbMediaSummary extends TmdbImageCollection {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  media_type?: MediaKind;
  adult?: boolean;
  original_language?: string;
}

export interface TmdbMediaDetails extends TmdbMediaSummary {
  runtime?: number | null;
  episode_run_time?: number[];
  genres: TmdbGenre[];
  status?: string;
  tagline?: string;
  homepage?: string | null;
  imdb_id?: string | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  videos?: { results: TmdbVideo[] };
  credits?: {
    cast: TmdbCastMember[];
    crew: TmdbCrewMember[];
  };
  similar?: { results: TmdbMediaSummary[] };
  recommendations?: { results: TmdbMediaSummary[] };
  production_companies?: Array<{ id: number; name: string; logo_path: string | null }>;
  spoken_languages?: Array<{ english_name: string; iso_639_1: string; name: string }>;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TmdbPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbDiscoverOptions {
  page?: number;
  genre?: number;
  year?: number;
  language?: string;
  sortBy?: string;
  includeAdult?: boolean;
}

export class TmdbError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new TmdbError("TMDB_API_KEY is not configured.");
  }
  return apiKey;
}

async function tmdbRequest<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  try {
    const response = await axios.get<T>(`${TMDB_BASE_URL}${path}`, {
      params: {
        api_key: getApiKey(),
        language: "en-US",
        ...params
      },
      timeout: 12000,
      headers: { Accept: "application/json" }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ status_message?: string }>;
      const message =
        axiosError.response?.data?.status_message ??
        axiosError.message ??
        "TMDB request failed.";
      throw new TmdbError(message, axiosError.response?.status);
    }
    if (error instanceof TmdbError) {
      throw error;
    }
    throw new TmdbError("An unexpected error occurred while contacting TMDB.");
  }
}

export function tmdbImage(
  path: string | null | undefined,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string | null {
  if (!path || !path.startsWith("/")) {
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function mediaTitle(media: TmdbMediaSummary): string {
  return media.title ?? media.name ?? media.original_title ?? media.original_name ?? "Untitled";
}

export function mediaYear(media: TmdbMediaSummary): number | null {
  const date = media.release_date ?? media.first_air_date;
  if (!date || !/^\d{4}/.test(date)) {
    return null;
  }
  const year = Number(date.slice(0, 4));
  return Number.isFinite(year) ? year : null;
}

export async function getTrending(
  kind: MediaKind | "all" = "all",
  window: "day" | "week" = "week",
  page = 1
): Promise<TmdbPage<TmdbMediaSummary>> {
  const safePage = Math.min(500, Math.max(1, Math.floor(page)));
  return tmdbRequest<TmdbPage<TmdbMediaSummary>>(`/trending/${kind}/${window}`, {
    page: safePage
  });
}

export async function getPopular(
  kind: MediaKind = "movie",
  page = 1
): Promise<TmdbPage<TmdbMediaSummary>> {
  return tmdbRequest<TmdbPage<TmdbMediaSummary>>(`/${kind}/popular`, {
    page: Math.min(500, Math.max(1, Math.floor(page)))
  });
}

export async function getTopRated(
  kind: MediaKind = "movie",
  page = 1
): Promise<TmdbPage<TmdbMediaSummary>> {
  return tmdbRequest<TmdbPage<TmdbMediaSummary>>(`/${kind}/top_rated`, {
    page: Math.min(500, Math.max(1, Math.floor(page)))
  });
}

export async function discoverMedia(
  kind: MediaKind,
  options: TmdbDiscoverOptions = {}
): Promise<TmdbPage<TmdbMediaSummary>> {
  return tmdbRequest<TmdbPage<TmdbMediaSummary>>(`/discover/${kind}`, {
    page: Math.min(500, Math.max(1, Math.floor(options.page ?? 1))),
    with_genres: options.genre,
    primary_release_year: kind === "movie" ? options.year : undefined,
    first_air_date_year: kind === "tv" ? options.year : undefined,
    with_original_language: options.language,
    sort_by: options.sortBy ?? "popularity.desc",
    include_adult: options.includeAdult ?? false
  });
}

export async function searchMedia(
  query: string,
  kind: MediaKind | "multi" = "multi",
  page = 1
): Promise<TmdbPage<TmdbMediaSummary>> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 1 || trimmedQuery.length > 160) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return tmdbRequest<TmdbPage<TmdbMediaSummary>>(`/search/${kind}`, {
    query: trimmedQuery,
    page: Math.min(500, Math.max(1, Math.floor(page))),
    include_adult: false
  });
}

export async function getMediaDetails(
  id: number | string,
  kind: MediaKind = "movie"
): Promise<TmdbMediaDetails> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new TmdbError("A valid TMDB ID is required.");
  }
  return tmdbRequest<TmdbMediaDetails>(`/${kind}/${numericId}`, {
    append_to_response: "videos,credits,similar,recommendations"
  });
}

export async function getGenres(kind: MediaKind): Promise<TmdbGenre[]> {
  const response = await tmdbRequest<{ genres: TmdbGenre[] }>(`/genre/${kind}/list`);
  return response.genres;
}

export async function getMovieWatchProviders(
  id: number | string,
  kind: MediaKind = "movie"
): Promise<Record<string, unknown>> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new TmdbError("A valid TMDB ID is required.");
  }
  const response = await tmdbRequest<{ results: Record<string, unknown> }>(
    `/${kind}/${numericId}/watch/providers`
  );
  return response.results;
}
