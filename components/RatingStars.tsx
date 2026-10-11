import { Star } from "lucide-react";
export default function RatingStars({ value = 0 }: { value: number }) {
  const pct = value * 10;
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i <= Math.round(value / 2)
                ? "text-yellow-400"
                : "text-neutral-600"
            }
            fill={i <= Math.round(value / 2) ? "currentColor" : "none"}
          />
        ))}
      </span>
      <span className="text-xs text-neutral-400">
        {value.toFixed(1)}/10 ({pct.toFixed(0)}%)
      </span>
    </span>
  );
}
