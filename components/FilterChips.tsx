"use client";

export type FilterChip = { value: string; label: string };
export default function FilterChips({ options, value, onChange, label }: { options: FilterChip[]; value: string; onChange: (value: string) => void; label?: string }) {
  return <div className="flex flex-wrap items-center gap-2" aria-label={label || "Filters"}>{options.map((option) => <button key={option.value} type="button" onClick={() => onChange(option.value)} aria-pressed={value === option.value} className={"rounded-full border px-3 py-1.5 text-xs font-semibold transition " + (value === option.value ? "border-neon-pink bg-neon-pink/15 text-neon-pink" : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600 hover:text-white")}>{option.label}</button>)}</div>;
}
