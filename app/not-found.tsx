import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center">
      <p className="gradient-text text-7xl font-black">404</p>
      <h1 className="mt-4 text-3xl font-bold">This scene is missing</h1>
      <p className="mt-3 text-neutral-400">We could not find the page you were looking for. It may have moved or the link may be incorrect.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-neon-pink px-5 py-3 font-bold text-white hover:brightness-110"><ArrowLeft size={18} /> Go home</Link>
        <Link href="/search" className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-3 font-semibold hover:border-neon-pink"><Search size={18} /> Search titles</Link>
      </div>
    </section>
  );
}
