"use client";
import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export default function ShareButton({ title, text, url }: { title?: string; text?: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: title || document.title, text, url: shareUrl }); return; } catch (error) { if (error instanceof Error && error.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { window.prompt("Copy this link", shareUrl); }
  };
  return <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:border-neutral-600 hover:text-white" aria-label="Share this page">{copied ? <Check size={16} /> : (navigatorShareIcon())}{copied ? "Link copied" : "Share"}</button>;
}
function navigatorShareIcon() { return <Share2 size={16} />; }
