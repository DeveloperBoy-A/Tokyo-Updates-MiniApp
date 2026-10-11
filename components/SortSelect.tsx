"use client";

export type SortOption = { value: string; label: string };
export default function SortSelect({ value, options, onChange, label = "Sort by" }: { value: string; options: SortOption[]; onChange: (value: string) => void; label?: string }) {
  return <label className="inline-flex items-center gap-2 text-sm text-neutral-400"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neon-pink">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
