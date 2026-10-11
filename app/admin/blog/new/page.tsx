"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

const inputClass = "mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm outline-none focus:border-pink-500";

export default function NewAdminBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function makeSlug(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Title and article content are required.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: makeSlug(slug || title),
          excerpt: excerpt.trim() || null,
          content: content.trim(),
          cover_image: coverImage.trim() || null,
          status
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to create blog post.");
      router.push("/admin/blog");
      router.refresh();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to create blog post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"><ArrowLeft size={16} /> Back to blog</Link>
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-400">Publishing</p><h1 className="mt-2 text-3xl font-black">Create blog post</h1><p className="mt-2 text-sm text-neutral-400">Write an article and save it as a draft or publish it.</p></div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7">
        <label className="block text-sm font-semibold">Title *<input required maxLength={200} value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(makeSlug(e.target.value)); }} className={inputClass} placeholder="Article title" /></label>
        <label className="block text-sm font-semibold">URL slug<input maxLength={200} value={slug} onChange={(e) => setSlug(makeSlug(e.target.value))} className={inputClass} placeholder="article-url-slug" /></label>
        <label className="block text-sm font-semibold">Excerpt<textarea rows={2} maxLength={500} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputClass} placeholder="Short summary shown in blog listings" /></label>
        <label className="block text-sm font-semibold">Cover image URL<input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={inputClass} placeholder="https://…" /></label>
        <label className="block text-sm font-semibold">Article content *<textarea required rows={14} value={content} onChange={(e) => setContent(e.target.value)} className={inputClass} placeholder="Write the article content here…" /></label>
        <label className="block text-sm font-semibold">Status<select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className={inputClass}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        {error && <p role="alert" className="rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-neutral-800 pt-5"><Link href="/admin/blog" className="rounded-xl border border-neutral-700 px-4 py-3 text-sm font-semibold">Cancel</Link><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold disabled:opacity-60"><Save size={16} />{busy ? "Saving…" : "Save post"}</button></div>
      </form>
    </div>
  );
}
