import { img } from "@/lib/tmdb";

export default function PosterImage({ path, title, className = "", priority = false }: { path?: string | null; title: string; className?: string; priority?: boolean }) {
  return <div className={"relative overflow-hidden bg-neutral-900 " + className}>{path ? <img src={img(path)} alt={title} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} className="h-full w-full object-cover" /> : <div role="img" aria-label={`${title} poster unavailable`} className="flex h-full min-h-40 w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 p-4 text-center text-sm font-semibold text-neutral-500">{title}</div>}</div>;
}
