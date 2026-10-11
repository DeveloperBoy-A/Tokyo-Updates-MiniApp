import Link from "next/link";
import { Film, LayoutDashboard, Clapperboard, PlusCircle, Settings, BarChart3, FileText, Link2, Users, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/movies", label: "Movies", icon: Film },
  { href: "/admin/movies/new", label: "Add movie", icon: PlusCircle },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/ads", label: "Ads", icon: Clapperboard },
  { href: "/admin/shortener", label: "Short links", icon: Link2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 bg-neutral-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3 font-black tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-pink-600"><ShieldCheck size={22} /></span>
            <span>Tokyo <span className="text-pink-400">Admin</span><span className="ml-2 rounded border border-neutral-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Control panel</span></span>
          </Link>
          <Link href="/" className="text-sm text-neutral-400 transition hover:text-white">← View website</Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-neutral-800 bg-neutral-900 p-3">
          <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-[.2em] text-neutral-500">Workspace</p>
          <nav aria-label="Admin navigation" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-300 transition hover:bg-neutral-800 hover:text-white">
                <Icon size={17} className="shrink-0 text-pink-400" />{label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950 p-3">
            <p className="text-xs font-semibold text-neutral-300">Admin access</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">Sign in with an email listed in ADMIN_EMAILS.</p>
            <Link href="/admin/login" className="mt-3 inline-flex text-xs font-bold text-pink-400 hover:text-pink-300">Sign in / account access →</Link>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
