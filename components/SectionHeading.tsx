import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({ title, subtitle, href, linkLabel = "View all", eyebrow }: { title: string; subtitle?: string; href?: string; linkLabel?: string; eyebrow?: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-bold uppercase tracking-[.2em] text-neon-pink">{eyebrow}</p> : null}
        <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-neutral-400">{subtitle}</p> : null}
      </div>
      {href ? <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-neon-pink hover:text-pink-300">{linkLabel}<ArrowRight size={15} /></Link> : null}
    </div>
  );
}
