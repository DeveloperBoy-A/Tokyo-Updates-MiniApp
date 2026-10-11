import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  if (!/^[a-z0-9-]+$/.test(params.slug)) return { title: "Post" };
  const file = path.join(process.cwd(), "content/blog", params.slug + ".mdx");
  if (!fs.existsSync(file)) return { title: "Post" };
  const { data } = matter(fs.readFileSync(file, "utf8"));
  return { title: data.title, description: data.excerpt };
}
export default function Post({ params }: { params: { slug: string } }) {
  if (!/^[a-z0-9-]+$/.test(params.slug)) return notFound();
  const file = path.join(process.cwd(), "content/blog", params.slug + ".mdx");
  if (!fs.existsSync(file)) return notFound();
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return (
    <article className="prose max-w-3xl mx-auto">
      <h1 className="gradient-text">{data.title}</h1>
      <p className="text-neutral-400 text-sm not-prose">{data.date}</p>
      <div className="mt-6">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
