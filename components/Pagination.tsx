"use client";
import { useRouter, useSearchParams } from "next/navigation";
export default function Pagination({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const router = useRouter(),
    params = useSearchParams();
  if (total <= 1) return null;
  const go = (n: number) => {
    const p = new URLSearchParams(params.toString());
    p.set("page", String(n));
    router.push("?" + p.toString());
  };
  return (
    <div className="flex justify-center gap-3 mt-8">
      <button
        disabled={current <= 1}
        onClick={() => go(current - 1)}
        className="px-4 py-2 bg-neutral-800 rounded"
      >
        Previous
      </button>
      <span className="px-4 py-2">
        {current} / {total}
      </span>
      <button
        disabled={current >= total}
        onClick={() => go(current + 1)}
        className="px-4 py-2 bg-neutral-800 rounded"
      >
        Next
      </button>
    </div>
  );
}
