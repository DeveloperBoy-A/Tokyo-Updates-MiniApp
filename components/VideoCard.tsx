import { Play } from "lucide-react";

export default function VideoCard({ name, keyValue, site = "YouTube", type }: { name: string; keyValue: string; site?: string; type?: string }) {
  const url = site.toLowerCase() === "youtube" ? `https://www.youtube.com/watch?v=${encodeURIComponent(keyValue)}` : site.toLowerCase() === "vimeo" ? `https://vimeo.com/${encodeURIComponent(keyValue)}` : null;
  if (!url) return null;
  return <a href={url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 hover:border-neon-pink/60"><div className="relative aspect-video bg-neutral-950"><img src={site.toLowerCase() === "youtube" ? `https://img.youtube.com/vi/${encodeURIComponent(keyValue)}/hqdefault.jpg` : ""} alt="" loading="lazy" className="h-full w-full object-cover" /><span className="absolute inset-0 grid place-items-center bg-black/20 transition group-hover:bg-black/40"><span className="grid h-12 w-12 place-items-center rounded-full bg-neon-pink text-white"><Play size={20} fill="currentColor" /></span></span></div><div className="p-3"><p className="line-clamp-2 text-sm font-semibold">{name}</p><p className="mt-1 text-xs text-neutral-500">{type || "Video"} · {site}</p></div></a>;
}
