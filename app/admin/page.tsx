import Link from "next/link";
import { redirect } from "next/navigation";
import { Film, FileText, Link2, Users, Plus, ArrowUpRight, ShieldCheck } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function countRows(table: string): Promise<number | null> {
  try {
    const client = createSupabaseAdminClient();
    const result = await client.from(table).select("*", { count: "exact", head: true });
    return result.error ? null : (result.count ?? 0);
  } catch {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const counts = await Promise.all(["movies", "blog_posts", "short_links", "profiles"].map(countRows));
  const cards = [
    { label: "Catalogue entries", count: counts[0], icon: Film, href: "/admin/movies", note: "Manage movie records" },
    { label: "Blog posts", count: counts[1], icon: FileText, href: "/admin/blog", note: "Publish site articles" },
    { label: "Short links", count: counts[2], icon: Link2, href: "/admin/shortener", note: "Manage redirects" },
    { label: "User profiles", count: counts[3], icon: Users, href: "/admin/users", note: "Review user accounts" }
  ];
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-pink-950/40 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-pink-400">Control centre</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-black sm:text-4xl">Dashboard</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">Manage Tokyo Updates content, catalogue and site tools from one place.</p><p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-900 bg-emerald-950/50 px-3 py-1.5 text-xs text-emerald-300"><ShieldCheck size={14} /> Signed in as {admin.email}</p></div><Link href="/admin/movies/new" className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-bold text-white hover:bg-pink-500"><Plus size={17} /> Add movie</Link></div>
      </section>
      <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Overview</h2><span className="text-xs text-neutral-500">Unavailable counts appear as —</span></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, count, icon: Icon, href, note }) => <Link key={label} href={href} className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-pink-500/60"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-800 text-pink-400"><Icon size={19} /></span><ArrowUpRight size={17} className="text-neutral-600 group-hover:text-pink-400" /></div><p className="mt-5 text-sm text-neutral-400">{label}</p><p className="mt-1 text-3xl font-black">{count === null ? "—" : count.toLocaleString()}</p><p className="mt-2 text-xs text-neutral-500">{note}</p></Link>)}</div>
      </section>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6"><h2 className="text-lg font-bold">Quick actions</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Link href="/admin/movies" className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4 hover:border-neutral-600"><span><span className="block font-semibold">Catalogue manager</span><span className="mt-1 block text-sm text-neutral-500">Search and review saved movie records</span></span><Film size={20} className="text-pink-400" /></Link><Link href="/admin/settings" className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4 hover:border-neutral-600"><span><span className="block font-semibold">Site settings</span><span className="mt-1 block text-sm text-neutral-500">Review configuration and integrations</span></span><ArrowUpRight size={20} className="text-pink-400" /></Link></div></section>
    </div>
  );
}