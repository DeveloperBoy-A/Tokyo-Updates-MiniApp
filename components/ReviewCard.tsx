import { Star } from "lucide-react";

export default function ReviewCard({ author, content, rating, date }: { author: string; content: string; rating?: number | null; date?: string }) {
  return <article className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{author || "Viewer"}</h3>{date ? <time className="mt-1 block text-xs text-neutral-500">{date}</time> : null}</div>{typeof rating === "number" && Number.isFinite(rating) ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300"><Star size={12} fill="currentColor" />{rating.toFixed(1)}/10</span> : null}</div><p className="mt-4 whitespace-pre-line text-sm leading-6 text-neutral-300">{content}</p></article>;
}
