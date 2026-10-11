"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application route error:", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center">
      <span className="rounded-full border border-red-500/30 bg-red-500/10 p-4 text-red-300"><AlertTriangle size={28} /></span>
      <h1 className="mt-5 text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-neutral-400">The page could not be loaded. Please try again. If the problem continues, come back in a little while.</p>
      {error.digest ? <p className="mt-2 text-xs text-neutral-600">Error reference: {error.digest}</p> : null}
      <button onClick={() => reset()} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neon-pink px-5 py-3 font-bold text-white hover:brightness-110"><RotateCcw size={18} /> Try again</button>
    </section>
  );
}
