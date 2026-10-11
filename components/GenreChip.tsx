import Link from "next/link";

export default function GenreChip({ id, name, active = false }: { id?: number | string; name: string; active?: boolean }) {
  const className = "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition " + (active ? "border-neon-pink bg-neon-pink/15 text-neon-pink" : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neon-pink/60 hover:text-white");
  if (id === undefined || id === null || id === "") return <span className={className}>{name}</span>;
  return <Link href={`/genres/${id}`} className={className}>{name}</Link>;
}
