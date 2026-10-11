"use client";
import { useState } from "react";
import { ArrowLeftRight, Check } from "lucide-react";

const STORAGE_KEY = "tokyo-compare-list";
export default function CompareButton({ item, mediaType = "movie" }: { item: { id: number; title?: string; name?: string; poster_path?: string | null; vote_average?: number }; mediaType?: "movie" | "tv" }) {
  const [added, setAdded] = useState(false);
  const toggle = () => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Array<{ id: number; mediaType: string }>;
      const exists = current.some((entry) => entry.id === item.id && entry.mediaType === mediaType);
      const next = exists ? current.filter((entry) => !(entry.id === item.id && entry.mediaType === mediaType)) : [...current.filter((entry) => entry.mediaType !== mediaType || entry.id !== item.id), { ...item, mediaType }].slice(-4);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setAdded(!exists);
      window.dispatchEvent(new CustomEvent("compare-list-change", { detail: next }));
    } catch { setAdded(false); }
  };
  return <button type="button" onClick={toggle} className={"inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition " + (added ? "border-neon-pink/50 bg-neon-pink/10 text-neon-pink" : "border-neutral-800 text-neutral-300 hover:border-neutral-600")} aria-pressed={added}>{added ? <Check size={15} /> : <ArrowLeftRight size={15} />}{added ? "Added to compare" : "Compare"}</button>;
}
