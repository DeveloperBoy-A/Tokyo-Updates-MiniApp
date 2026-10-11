import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export default async function AdminBlogPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  let posts: any[] = [];
  let issue = "";
  try {
    const result = await createSupabaseAdminClient().from("blog_posts").select("id,title,slug,status,created_at").order("created_at", { ascending: false }).limit(100);
    if (result.error) issue = result.error.message; else posts = result.data ?? [];
  } catch (e) { issue = e instanceof Error ? e.message : "Unable to load posts."; }
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-pink-400">Publishing</p><h1 className="mt-2 text-3xl font-black">Blog posts</h1><p className="mt-2 text-sm text-neutral-400">Manage articles from your blog_posts table.</p></div><Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-bold"><Plus size={17}/> New post</Link></div>{issue ? <p className="rounded-xl border border-amber-900 bg-amber-950/30 p-5 text-sm text-amber-200">Could not load posts: {issue}</p> : <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"><p className="border-b border-neutral-800 px-5 py-4 font-semibold">{posts.length} posts loaded</p>{posts.length ? posts.map((post:any)=><div key={post.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-neutral-800 text-pink-400"><FileText size={18}/></span><div><p className="font-semibold">{post.title || "Untitled post"}</p><p className="mt-1 text-xs text-neutral-500">/{post.slug || ""} · {post.status || "unknown"}</p></div></div><Link href={"/admin/blog/"+encodeURIComponent(String(post.id))} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:border-pink-500">Edit</Link></div>) : <div className="p-10 text-center"><p className="font-semibold">No blog posts found</p><Link href="/admin/blog/new" className="mt-3 inline-block text-sm font-bold text-pink-400">Create a post →</Link></div>}</div>}</div>;
}
