const styles: Record<string, string> = { active: "border-emerald-800 bg-emerald-950/50 text-emerald-300", published: "border-emerald-800 bg-emerald-950/50 text-emerald-300", enabled: "border-emerald-800 bg-emerald-950/50 text-emerald-300", pending: "border-amber-800 bg-amber-950/50 text-amber-300", draft: "border-neutral-700 bg-neutral-900 text-neutral-300", disabled: "border-neutral-700 bg-neutral-900 text-neutral-400", failed: "border-rose-800 bg-rose-950/50 text-rose-300", expired: "border-rose-800 bg-rose-950/50 text-rose-300" };
export default function StatusBadge({ status }: { status: string | boolean | null | undefined }) {
  const label = status === true ? "Enabled" : status === false ? "Disabled" : String(status ?? "Unknown").replace(/[_-]+/g, " ");
  const key = label.toLowerCase();
  return <span className={"inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize " + (styles[key] || "border-neutral-700 bg-neutral-900 text-neutral-300")}>{label}</span>;
}
