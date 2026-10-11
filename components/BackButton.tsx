"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Go back", fallback = "/" }: { label?: string; fallback?: string }) {
  const router = useRouter();
  return <button type="button" onClick={() => { if (window.history.length > 1) router.back(); else router.push(fallback); }} className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-300 transition hover:border-neutral-600 hover:text-white"><ArrowLeft size={16} />{label}</button>;
}
