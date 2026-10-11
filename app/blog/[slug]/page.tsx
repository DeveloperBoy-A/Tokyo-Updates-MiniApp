import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };
function readPost(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const root = path.resolve(process.cwd(), "content", "blog");
  const file = path.resolve(root, slug + ".mdx");
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return null;
  const parsed = matter(fs.readFileSync(file, "utf8"));
  return { ...parsed, title: String(parsed.data.title ?? "Article"), excerpt: String(parsed.data.excerpt ?? ""), date: String(parsed.data.date ?? "") };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = readPost(params.slug);
  return post ? { title: post.title, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: "article" } } : { title: "Article not found" };
}
export default function BlogPostPage({ params }: Props) {
  const post = readPost(params.slug);
  if (!post) notFound();
  return <main className="mx-auto max-w-3xl py-6"><Link href="/blog" className="text-sm text-neon-pink hover:underline">← Back to articles</Link><article className="mt-6"><header className="border-b border-neutral-800 pb-6"><p className="text-sm text-neutral-500">{post.date}</p><h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl gradient-text">{post.title}</h1>{post.excerpt && <p className="mt-4 text-lg leading-7 text-neutral-400">{post.excerpt}</p>}</header><div className="prose prose-invert mt-8 max-w-none prose-a:text-pink-400 prose-headings:text-white prose-strong:text-white"><MDXRemote source={post.content} /></div></article></main>;
}
