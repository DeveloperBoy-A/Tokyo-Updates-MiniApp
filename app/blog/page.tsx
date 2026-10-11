import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
export const metadata = { title: "Reviews & News" };
export default function BlogIndex() {
  const dir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(dir)) return <p>No posts yet.</p>;
  const posts = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return { slug: file.replace(".mdx", ""), ...data } as any;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📝 Movie Reviews & News</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((p: any) => (
          <Link
            key={p.slug}
            href={"/blog/" + p.slug}
            className="block bg-neutral-900 hover:bg-neutral-800 rounded-xl p-5 border border-neutral-800 glow-hover"
          >
            <h2 className="font-bold text-lg line-clamp-2">{p.title}</h2>
            <p className="text-sm text-neutral-400 mt-2 line-clamp-3">
              {p.excerpt}
            </p>
            <p className="text-xs text-neutral-500 mt-4">{p.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
