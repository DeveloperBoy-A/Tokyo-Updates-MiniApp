const tones: Record<string, string> = { G: "border-emerald-700 text-emerald-300", PG: "border-sky-700 text-sky-300", "PG-13": "border-amber-700 text-amber-300", R: "border-rose-700 text-rose-300", "TV-14": "border-amber-700 text-amber-300", "TV-MA": "border-rose-700 text-rose-300" };
export default function ContentRating({ rating }: { rating?: string | null }) {
  if (!rating?.trim()) return null;
  const value = rating.trim().toUpperCase();
  return <span className={"inline-flex rounded border px-2 py-0.5 text-xs font-bold tracking-wide " + (tones[value] || "border-neutral-600 text-neutral-300")}>{value}</span>;
}
