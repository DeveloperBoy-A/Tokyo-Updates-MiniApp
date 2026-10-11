"import Link from "next/link";
import { CalendarDays, ArrowUpRight } from "lucide-react";

type BlogCardProps = {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  category?: string;
  cover?: string;
};

export default function BlogCard({ slug, title, excerpt, date, category = "Entertainment", cover }: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 transition hover:border-neon-pink/60">
      <Link href={`/blog/${slug}`} className="block overflow-hidden">
        {cover ? <img src={cover} alt="" loading="lazy" className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-fuchsia-950 to-neutral-900 text-4xl" aria-hidden="true">🎬</div>}
      </Link>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-neon-pink">{category}</p>
        <h2 className="mt-2 text-lg font-bold leading-snug"><Link href={`/blog/${slug}`} className="hover:text-neon-pink">{title}</Link></h2>
        {excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-400">{excerpt}</p> : null}
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1.5"> <CalendarDays size={13} /> {date || "Recently published"}</span>
          <Link href={`/blog/${slug}`} className="inline-flex items-center gap-1 text-neon-pink">Read article <ArrowUpRight size={13} /></Link>
        </div>
      </div>
    </article>
  );
}
