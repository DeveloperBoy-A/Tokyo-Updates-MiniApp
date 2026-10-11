import type { LucideIcon } from "lucide-react";

export default function AdminStatCard({ label, value, detail, Icon }: { label: string; value: string | number | null; detail?: string; Icon: LucideIcon }) {
  return <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm text-neutral-400">{label}</p><span className="grid h-9 w-9 place-items-center rounded-lg bg-pink-500/10 text-pink-300"><Icon size={18} /></span></div><p className="mt-4 text-3xl font-black tabular-nums">{value === null ? "—" : typeof value === "number" ? value.toLocaleString() : value}</p>{detail ? <p className="mt-2 text-xs text-neutral-500">{detail}</p> : null}</article>;
}
