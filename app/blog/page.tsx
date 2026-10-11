import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import matter from "gray-matter";

export const metadata: Metadata = { title: "Movie Reviews & News", description: "Read movie reviews, entertainment articles and TV news from Tokyo Updates." };
type Post = { slug: string; title?: string; excerpt?: string; date?: string; category?: string; cover?: string };
export default function BlogIndex() {
  const directory = path.join(process.cwd(), "content", "blog");
  const posts: Post[] = fs.existsSync(directory) ? fs.readdirSync(directory).filter((file) => file.endsWith(".mdx")).map((file) => {
    const parsed = matter(fs.readFileSync(path.join(directory, file), "utf8"));
    return { slug: file.replace(/\.mdx$/, ""), title: String(parsed.data.title ?? "Untitled article"), excerpt: String(parsed.data.excerpt ?? ""), date: String(parsed.data.date ?? ""), category: String(parsed.data.category ?? "Entertainment"), cover: typeof parsed.data.cover === "string" ? parsed.data.cover : undefined };
  }).sort((a, b) => b.date.localeCompare(a.date)) : [];
  return <main className="py-4"><header className="mb-8"><p className="mb-1 text-sm uppercase tracking-widest text-neon-pink">The latest from the screen</p><h1 className="text-3xl font-extrabold">Movie Reviews & News</h1><p className="mt-2 text-neutral-400">Reviews, watch guides and stories for movie and series fans.</p></header>{posts.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.slug} className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 transition hover:border-neon-pink/60">{post.cover ? <img src={post.cover} alt="" className="aspect-video w-full object-cover" loading="lazy"/> : <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-fuchsia-950 to-neutral-900 text-4xl">🎬</div>}<div className="p-5"><p className="text-xs uppercase tracking-wide text-neon-pink">{post.category}</p><h2 className="mt-2 text-lg font-bold"><Link href={`/blog/${post.slug}`} className="hover:text-neon-pink">{post.title}</Link></h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-400">{post.excerpt}</p><div className="mt-4 flex items-center justify-between text-xs text-neutral-500"><time>{post.date}</time><Link href={`/blog/${post.slug}`} className="text-neon-pink">Read article →</Link></div></div></article>)}</div> : <div className="rounded-xl border border-neutral-800 p-8 text-neutral-400">No articles have been published yet. Check back soon.</div>}</main>;
}
