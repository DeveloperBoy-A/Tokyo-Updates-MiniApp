"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Home, Film, Tv, BookOpen, Heart, Menu, X } from "lucide-react";
const links = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/movies", label: "Movies", Icon: Film },
  { href: "/tv", label: "TV Shows", Icon: Tv },
  { href: "/blog", label: "Reviews", Icon: BookOpen },
  { href: "/watchlist", label: "Watchlist", Icon: Heart },
];
export default function Navbar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push("/movies?q=" + encodeURIComponent(q.trim()));
      setOpen(false);
    }
  };
  return (
    <header
      className={
        "sticky top-0 z-50 border-b border-neutral-800 " +
        (scrolled
          ? "bg-neutral-950/95 backdrop-blur-xl"
          : "bg-neutral-950/80 backdrop-blur")
      }
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-5">
        <Link
          href="/"
          className="shrink-0 font-black text-xl md:text-2xl gradient-text"
        >
          🎬 Tokyo_Updates
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm " +
                (pathname === href
                  ? "text-neon-pink bg-neon-pink/10"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800")
              }
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <form
          onSubmit={submit}
          className="hidden md:flex ml-auto items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 w-56"
        >
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search movies..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </form>
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden ml-auto p-2"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div
          className="fixed inset-0 top-16 bg-black/70 menu-overlay lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-neutral-950 border-b border-neutral-800 p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={submit}
              className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-3"
            >
              <Search size={17} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search movies..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </form>
            {links.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-900"
              >
                <Icon size={19} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
