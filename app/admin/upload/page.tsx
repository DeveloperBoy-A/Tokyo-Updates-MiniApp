"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileUp, UploadCloud } from "lucide-react";

export default function AdminUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [destination, setDestination] = useState("posters");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setError(false);
    if (!file) { setMessage("Select a file first."); setError(true); return; }
    if (file.size > 10 * 1024 * 1024) { setMessage("File must be 10 MB or smaller."); setError(true); return; }
    setBusy(true);
    try {
      const body = new FormData(); body.append("file", file); body.append("destination", destination);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setMessage(data.url ? "Upload complete: " + data.url : "Upload completed."); setError(false);
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Upload failed."); setError(true); }
    finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-2xl space-y-6"><Link href="/admin" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"><ArrowLeft size={16}/> Dashboard</Link><div><p className="text-xs font-bold uppercase tracking-widest text-pink-400">Media library</p><h1 className="mt-2 text-3xl font-black">Upload file</h1><p className="mt-2 text-sm leading-6 text-neutral-400">Upload images or supported media using the protected admin upload endpoint. Maximum file size: 10 MB.</p></div><form onSubmit={submit} className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-7"><div className="grid place-items-center rounded-xl border border-dashed border-neutral-700 bg-neutral-950 px-5 py-10 text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-600/15 text-pink-400"><UploadCloud size={28}/></span><label className="mt-4 cursor-pointer font-semibold hover:text-pink-300">Choose a file<input type="file" accept="image/*,video/mp4,application/pdf" onChange={e=>setFile(e.target.files?.[0] ?? null)} className="mt-3 block max-w-full text-sm text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-neutral-100"/></label><p className="mt-2 text-xs text-neutral-500">{file ? file.name + " · " + (file.size/1024/1024).toFixed(2) + " MB" : "Images, MP4 video or PDF"}</p></div><label className="block text-sm font-semibold">Destination<select value={destination} onChange={e=>setDestination(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3"><option value="posters">Posters</option><option value="blog">Blog images</option><option value="general">General media</option></select></label>{message && <p role="status" className={`break-words rounded-xl border p-3 text-sm ${error?"border-red-900 bg-red-950/40 text-red-300":"border-emerald-900 bg-emerald-950/40 text-emerald-300"}`}>{message}</p>}<button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 font-bold hover:bg-pink-500 disabled:opacity-50"><FileUp size={17}/>{busy?"Uploading…":"Upload file"}</button></form></div>;
}
