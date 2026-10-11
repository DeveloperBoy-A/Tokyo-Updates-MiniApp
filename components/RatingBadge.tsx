import { Star } from "lucide-react";

export default function RatingBadge({ rating, votes, size = "md" }: { rating?: number | null; votes?: number; size?: "sm" | "md" }) {
  const valid = typeof rating === "number" && Number.isFinite(rating);
  return (
    <span className={"inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 font-semibold text-amber-300 " + (size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm")} aria-label={valid ? `Rating ${rating.toFixed(1)} out of 10` : "Rating unavailable"}>
      <Star size={size === "sm" ? 12 : 14} fill="currentColor" />
      {valid ? rating.toFixed(1) : "N/A"}
      {typeof votes === "number" && votes > 0 ? <span className="font-normal text-amber-200/70">· {votes.toLocaleString()}</span> : null}
    </span>
  );
}
