"use client";
import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { getWatchlist } from "@/lib/watchlist";
export default function WatchlistPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const sync = () => setItems(getWatchlist());
    sync();
    window.addEventListener("watchlist-change", sync);
    return () => window.removeEventListener("watchlist-change", sync);
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 gradient-text">❤️ My Watchlist</h1>
      {items.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <MovieCard
              key={item.mediaType + item.id}
              movie={item}
              mediaType={item.mediaType || "movie"}
            />
          ))}
        </div>
      ) : (
        <p className="text-neutral-400">
          Watchlist khaali hai. Kisi movie pe ❤️ dabao.
        </p>
      )}
    </div>
  );
}
