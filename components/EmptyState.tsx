import type { ReactNode } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description, actionHref, actionLabel, icon }: { title?: string; description?: string; actionHref?: string; actionLabel?: string; icon?: ReactNode }) {
  return (
    <section className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/40 px-5 py-10 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-neutral-800 text-neon-pink">{icon ?? <SearchX size={22} />}</div>
      <h2 className="text-lg font-bold">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">{description}</p> : null}
      {actionHref && actionLabel ? <Link href={actionHref} className="mt-5 rounded-lg bg-neon-pink px-4 py-2 text-sm font-bold text-white hover:opacity-90">{actionLabel}</Link> : null}
    </section>
  );
}
