import type { Metadata } from "next";
import Link from "next/link";
import { img } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Popular Actors", description: "Discover popular film and television performers." };
type Person = { id: number; name: string; profile_path: string | null; known_for_department?: string; known_for?: Array<{ title?: string; name?: string; media_type?: string }> };
export default async function ActorsPage() {
  let people: Person[] = [];
  try {
    const key = process.env.TMDB_API_KEY;
    if (key) {
      const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${encodeURIComponent(key)}&language=en-US&page=1`, { next: { revalidate: 21600 } });
      if (response.ok) { const json = await response.json(); people = Array.isArray(json.results) ? json.results : []; }
    }
  } catch { people = []; }
  return <main className="py-4"><header className="mb-7"><p className="mb-1 text-sm uppercase tracking-widest text-neon-pink">People to know</p><h1 className="text-3xl font-extrabold">Popular Actors & Creators</h1><p className="mt-2 text-neutral-400">Explore performers currently popular with movie and TV audiences.</p></header>{people.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{people.map((person) => <article key={person.id} className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60"><img src={img(person.profile_path, "w342")} alt={person.name} loading="lazy" className="aspect-[3/4] w-full bg-neutral-800 object-cover" /><div className="p-3"><h2 className="font-semibold">{person.name}</h2><p className="mt-1 text-xs text-neutral-500">{person.known_for_department || "Performer"}</p><p className="mt-2 line-clamp-2 text-xs text-neutral-400">{person.known_for?.map((item) => item.title ?? item.name).filter(Boolean).join(", ")}</p><Link href={`https://www.themoviedb.org/person/${person.id}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-neon-pink underline">View profile</Link></div></article>)}</div> : <p className="rounded-xl border border-neutral-800 p-8 text-neutral-400">Popular people could not be loaded. Check that TMDB_API_KEY is configured.</p>}</main>;
}
