"use client";
import { Play } from "lucide-react";

export default function TrailerButton({ videoKey, label = "Watch trailer", onPlay }: { videoKey?: string | null; label?: string; onPlay?: (key: string) => void }) {
  if (!videoKey) return null;
  return <button type="button" onClick={() => onPlay ? onPlay(videoKey) : window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(videoKey)}`, "_blank", "noopener,noreferrer")} className="inline-flex items-center gap-2 rounded-lg bg-neon-pink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-pink-500"><Play size={16} fill="currentColor" />{label}</button>;
}
