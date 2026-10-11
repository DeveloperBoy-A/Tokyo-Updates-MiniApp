import Link from "next/link";

export default function StreamingBadge({ name, href, logo }: { name: string; href?: string | null; logo?: string | null }) {
  const body = <span className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-200 transition hover:border-neutral-600">{logo ? <img src={logo} alt="" className="h-4 w-4 rounded object-cover" loading="lazy" /> : null}{name}</span>;
  return href ? <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name}`}>{body}</Link> : body;
}
