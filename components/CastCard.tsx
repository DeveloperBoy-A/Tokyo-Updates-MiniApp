import { img } from "@/lib/tmdb";

export default function CastCard({ person }: { person: { id: number; name: string; character?: string; profile_path?: string | null } }) {
  return <article className="min-w-28 max-w-32"><div className="aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900">{person.profile_path ? <img src={img(person.profile_path, "w185")} alt={person.name} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-3xl text-neutral-600" aria-label="No profile photo">👤</div>}</div><h3 className="mt-2 line-clamp-2 text-sm font-semibold">{person.name}</h3>{person.character ? <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{person.character}</p> : null}</article>;
}
