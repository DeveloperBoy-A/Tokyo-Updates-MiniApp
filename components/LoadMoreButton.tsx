"use client";
import { LoaderCircle, Plus } from "lucide-react";

export default function LoadMoreButton({ onClick, loading = false, hasMore = true, label = "Load more" }: { onClick: () => void; loading?: boolean; hasMore?: boolean; label?: string }) {
  if (!hasMore) return null;
  return <div className="flex justify-center py-6"><button type="button" onClick={onClick} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition hover:border-neon-pink disabled:cursor-wait disabled:opacity-60">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}{loading ? "Loading…" : label}</button></div>;
}
