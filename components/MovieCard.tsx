"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, Play } from "lucide-react";
import { img } from "@/lib/tmdb";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";
export default function MovieCard({
  movie,
  mediaType = "movie",
}: {
  movie: any;
  mediaType?: "movie" | "tv";
}) {
  const [liked, setLiked] = useState(false);
  const title = movie.title || movie.name;
  const release = (movie.release_date || movie.first_air_date || "").slice(
    0,
    4,
  );
  const href = mediaType === "tv" ? "/tv/" + movie.id : "/movies/" + movie.id;
  useEffect(() => {
    const sync = () => setLiked(isInWatchlist(movie.id, mediaType));
    sync();
    window.addEventListener("watchlist-change", sync);
    return () => window.removeEventListener("watchlist-change", sync);
  }, [movie.id, mediaType]);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ ...movie, title, mediaType });
    setLiked((v) => !v);
  };
  return (
    <Link
      href={href}
      className="group block rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neon-pink/50 glow-hover"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-neutral-800">
        <img
          src={img(movie.poster_path)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded">
          ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
        </span>
        <button
          onClick={toggle}
          aria-label="Add to watchlist"
          className={
            "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center " +
            (liked ? "bg-neon-pink text-white" : "bg-black/60 text-white")
          }
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
          <span className="flex gap-1 text-xs bg-neon-pink/90 px-2 py-1 rounded-full">
            <Play size={10} />
            View Details
          </span>
        </div>
      </div>
      <div className="p-2.5">
        <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
        <p className="text-xs text-neutral-500 mt-1">{release || "—"}</p>
      </div>
    </Link>
  );
}
