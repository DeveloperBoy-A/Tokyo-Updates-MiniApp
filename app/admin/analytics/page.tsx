import { redirect } from "next/navigation";
import { Activity, Film, FileText, Link2, Users, MousePointerClick } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Metric = { label: string; value: number | null; icon: typeof Film; note: string };

async function countRows(table: string): Promise<number | null> {
  try {
    const { count, error } = await createSupabaseAdminClient().from(table).select("*", { count: "exact", head: true });
    return error ? null : count ?? 0;
  } catch {
    return null;
  }
}

export default async function AdminAnalyticsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [movies, posts, links, users, clickResult] = await Promise.all([
    countRows("movies"),
    countRows("blog_posts"),
    countRows("short_links"),
    countRows("profiles"),
    (async () => {
      try {
        const result = await createSupabaseAdminClient().from("short_links").select("clicks");
        if (result.error) return { total: null as number | null, error: result.error.message };
        return { total: (result.data ?? []).reduce((sum: number, row: { clicks?: number | null }) => sum + Math.max(0, Number(row.clicks) || 0), 0), error: "" };
      } catch (reason: unknown) {
        return { total: null as number | null, error: reason instanceof Error ? reason.message : "Unable to read click counts." };
      }
    })()
  ]);

  const metrics: Metric[] = [
    { label: "Catalogue entries", value: movies, icon: Film, note: "Records in movies table" },
    { label: "Blog posts", value: posts, icon: FileText, note: "Records in blog_posts table" },
    { label: "Short links", value: links, icon: Link2, note: "Records in short_links table" },
    { label: "User profiles", value: users, icon: Users, note: "Records in profiles table" },
    { label: "Recorded short-link clicks", value: clickResult.total, icon: MousePointerClick, note: "Sum of short_links.clicks" }
  ];

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-400">Reports</p><h1 className="mt-2 flex items-center gap-3 text-3xl font-black"><Activity size={28} className="text-pink-400"/> Site analytics</h1><p className="mt-2 text-sm text-neutral-400">Live counts read from the configured Supabase tables.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{metrics.map(({ label, value, icon: Icon, note }) => <section key={label} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-800 text-pink-400"><Icon size={19}/></span><span className="text-xs text-neutral-500">Current total</span></div><p className="mt-5 text-sm text-neutral-400">{label}</p><p className="mt-1 text-3xl font-black">{value === null ? "—" : value.toLocaleString("en-IN")}</p><p className="mt-2 text-xs text-neutral-500">{note}</p></section>)}</div>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6"><h2 className="font-bold">About these metrics</h2><p className="mt-2 text-sm leading-6 text-neutral-400">These totals are queried when this page loads. Short-link clicks are summed from the stored click counters; they are not unique visitors. This dashboard does not currently track page views, sessions, referrers or time-series trends.</p>{clickResult.error && <p className="mt-3 break-words rounded-xl border border-amber-900 bg-amber-950/30 p-3 text-sm text-amber-200">Could not calculate short-link clicks: {clickResult.error}</p>}<p className="mt-3 text-xs text-neutral-500">Signed in as {admin.email}</p></section>
    </div>
  );
}
