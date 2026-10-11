import { Search } from "lucide-react";

export default function SearchResultsSummary({ query, count, mediaLabel = "results" }: { query: string; count: number; mediaLabel?: string }) {
  return <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400"><Search size={15} /><span>Results for <strong className="font-semibold text-white">“{query}”</strong></span><span className="rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-xs">{count.toLocaleString()} {mediaLabel}</span></div>;
}
