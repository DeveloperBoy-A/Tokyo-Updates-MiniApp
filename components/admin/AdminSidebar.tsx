"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Film, FileText, Settings, Link2, Users, Upload, Megaphone, Home } from "lucide-react";

const items = [{ href: "/admin", label: "Dashboard", Icon: Home }, { href: "/admin/movies", label: "Movies", Icon: Film }, { href: "/admin/upload", label: "Upload", Icon: Upload }, { href: "/admin/blog", label: "Blog", Icon: FileText }, { href: "/admin/ads", label: "Ads", Icon: Megaphone }, { href: "/admin/shortener", label: "Shortener", Icon: Link2 }, { href: "/admin/users", label: "Users", Icon: Users }, { href: "/admin/analytics", label: "Analytics", Icon: BarChart3 }, { href: "/admin/settings", label: "Settings", Icon: Settings }];
export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav aria-label="Admin navigation" className="space-y-1">{items.map(({ href, label, Icon }) => { const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(href + "/"); return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition " + (active ? "bg-pink-500/10 text-pink-300" : "text-neutral-400 hover:bg-neutral-900 hover:text-white")}><Icon size={17} />{label}</Link>; })}</nav>;
}
