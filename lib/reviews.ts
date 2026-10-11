import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface MovieReview {
  id: string;
  movie_id: string;
  user_id: string | null;
  display_name: string;
  rating: number;
  body: string;
  created_at: string;
}

export interface CreateReviewInput {
  movieId: string;
  displayName: string;
  rating: number;
  body: string;
  userId?: string | null;
}

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function validateReview(input: CreateReviewInput): void {
  if (!input.movieId.trim()) {
    throw new Error("Movie ID is required.");
  }
  if (input.displayName.trim().length < 2 || input.displayName.trim().length > 60) {
    throw new Error("Display name must be between 2 and 60 characters.");
  }
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 10) {
    throw new Error("Rating must be a whole number between 1 and 10.");
  }
  if (input.body.trim().length < 10 || input.body.trim().length > 2000) {
    throw new Error("Review must be between 10 and 2000 characters.");
  }
}

export async function getMovieReviews(movieId: string): Promise<MovieReview[]> {
  if (!movieId.trim()) {
    throw new Error("Movie ID is required.");
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("movie_reviews")
      .select("id,movie_id,user_id,display_name,rating,body,created_at")
      .eq("movie_id", movieId)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as MovieReview[];
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? `Unable to load reviews: ${error.message}` : "Unable to load reviews."
    );
  }
}

export async function createMovieReview(input: CreateReviewInput): Promise<MovieReview> {
  validateReview(input);

  try {
    const supabase = getSupabase();
    const payload = {
      movie_id: input.movieId,
      user_id: input.userId ?? null,
      display_name: input.displayName.trim(),
      rating: input.rating,
      body: input.body.trim(),
      is_public: true
    };

    const { data, error } = await supabase
      .from("movie_reviews")
      .insert(payload)
      .select("id,movie_id,user_id,display_name,rating,body,created_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as MovieReview;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? `Unable to submit review: ${error.message}` : "Unable to submit review."
    );
  }
}

export function averageReviewRating(reviews: MovieReview[]): number | null {
  if (reviews.length === 0) {
    return null;
  }
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
