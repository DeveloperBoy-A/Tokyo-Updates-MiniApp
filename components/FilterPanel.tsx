"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function FilterPanel({ genres }: { genres: any[] }) {
  const p = useSearchParams();
  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - i,
  );
  const build = (k: string, v: string) => {
    const n = new URLSearchParams(p.toString());
    n.set(k, v);
    n.delete("page");
    return "/movies?" + n.toString();
  };
  return (
    <aside className="md:w-60 shrink-0 space-y-6">
      <div>
        <h3 className="font-bold mb-3 text-sm uppercase text-neutral-400">
          Sort By
        </h3>
        {[
          { v: "popularity.desc", l: "Popular" },
          { v: "vote_average.desc", l: "Top Rated" },
          { v: "primary_release_date.desc", l: "Newest" },
          { v: "revenue.desc", l: "Box Office" },
        ].map((s) => (
          <Link
            key={s.v}
            className="block py-1 text-neutral-300"
            href={build("sort", s.v)}
          >
            {s.l}
          </Link>
        ))}
      </div>
      <div>
        <h3 className="font-bold mb-3 text-sm uppercase text-neutral-400">
          Genre
        </h3>
        {genres.map((g: any) => (
          <Link
            key={g.id}
            className="block py-1 text-neutral-300"
            href={build("genre", String(g.id))}
          >
            {g.name}
          </Link>
        ))}
      </div>
      <div>
        <h3 className="font-bold mb-3 text-sm uppercase text-neutral-400">
          Year
        </h3>
        {years.map((y) => (
          <Link
            key={y}
            className="inline-block mr-2 py-1 text-neutral-300"
            href={build("year", String(y))}
          >
            {y}
          </Link>
        ))}
      </div>
    </aside>
  );
}
