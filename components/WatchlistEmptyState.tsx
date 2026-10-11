import Link from "next/link";
import { Heart, Search } from "lucide-react";

export default function WatchlistEmptyState() {
  return <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 px-5 py-10 text-center"><span className="grid h-14 w-14 place-items-center rounded-full bg-neon-pink/10 text-neon-pink"><Heart size={24} /></span><h2 className="mt-4 text-xl font-bold">Your watchlist is empty</h2><p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400">Save movies and shows with the heart button and they will appear here on this device.</p><Link href="/movies" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-neon-pink px-4 py-2.5 text-sm font-bold text-white hover:bg-pink-500"><Search size={16} />Explore movies</Link></section>;
}
