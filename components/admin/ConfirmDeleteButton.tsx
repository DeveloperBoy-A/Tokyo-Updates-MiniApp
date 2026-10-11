"use client";
import { useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";

export default function ConfirmDeleteButton({ onConfirm, label = "Delete", confirmLabel = "Confirm delete", disabled = false }: { onConfirm: () => void | Promise<void>; label?: string; confirmLabel?: string; disabled?: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const run = async () => { if (!confirming) { setConfirming(true); return; } setBusy(true); try { await onConfirm(); } finally { setBusy(false); setConfirming(false); } };
  return <button type="button" disabled={disabled || busy} onClick={run} onBlur={() => { if (!busy) setConfirming(false); }} className={"inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50 " + (confirming ? "border-rose-700 bg-rose-950 text-rose-200" : "border-neutral-800 text-neutral-300 hover:border-rose-700 hover:text-rose-300")}>{busy ? <LoaderCircle size={15} className="animate-spin" /> : <Trash2 size={15} />}{busy ? "Deleting…" : confirming ? confirmLabel : label}</button>;
}
