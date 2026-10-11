"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { getWatchlist, toggleWatchlist } from "@/lib/watchlist";

type Item = { id: number; title?: string; name?: string; mediaType?: "movie" | "tv"; [key: string]: unknown };
export default function WatchlistPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  useEffect(() => {
    const sync = () => setItems(getWatchlist() as Item[]);
    sync();
    window.addEventListener("watchlist-change", sync);
    return () => window.removeEventListener("watchlist-change", sync);
  }, []);
  const visible = items.filter((item) => filter === "all" || (item.mediaType ?? "movie") === filter);
  const clear = (item: Item) => { toggleWatchlist(item); setItems(getWatchlist() as Item[]); };
  return <main className="py-4"><header className="mb-7 flex flex-wrap items-start justify-between gap-4"><div><p className="mb-1 text-sm uppercase tracking-widest text-neon-pink">Your personal collection</p><h1 className="flex items-center gap-3 text-3xl font-extrabold"><Heart className="text-neon-pink" /> My Watchlist</h1><p className="mt-2 text-neutral-400">{items.length} saved {items.length === 1 ? "title" : "titles"}</p></div><div className="flex gap-2">{(["all", "movie", "tv"] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-full border px-3 py-2 text-sm capitalize ${filter === value ? "border-neon-pink bg-neon-pink/10" : "border-neutral-700"}`}>{value === "all" ? "All" : value === "tv" ? "TV Shows" : "Movies"}</button>)}</div></header>{visible.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{visible.map((item) => <div key={(item.mediaType ?? "movie") + item.id} className="group relative"><MovieCard movie={item} mediaType={item.mediaType ?? "movie"} /><button onClick={() => clear(item)} title="Remove from watchlist" aria-label={`Remove ${item.title ?? item.name ?? "title"} from watchlist`} className="absolute bottom-16 right-2 z-10 rounded-full bg-black/80 p-2 text-white opacity-100 transition hover:bg-red-600"><Trash2 size={15}/></button></div>)}</div> : <div className="rounded-2xl border border-dashed border-neutral-700 p-10 text-center"><Heart size={32} className="mx-auto text-neutral-500"/><h2 className="mt-4 text-xl font-bold">{items.length ? "No titles in this filter" : "Your watchlist is empty"}</h2><p className="mt-2 text-neutral-400">Save movies or shows using the heart icon on a title card.</p><Link href="/movies" className="mt-5 inline-block rounded-lg bg-neon-pink px-5 py-3 font-semibold">Explore movies</Link></div>}</main>;
}
