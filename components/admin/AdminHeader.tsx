import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminHeader({ title, description, email }: { title: string; description?: string; email?: string }) {
  return <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800 pb-5"><div><p className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.2em] text-pink-400"><ShieldCheck size={13} /> Admin console</p><h1 className="text-2xl font-black sm:text-3xl">{title}</h1>{description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">{description}</p> : null}{email ? <p className="mt-2 text-xs text-neutral-500">Signed in as {email}</p> : null}</div><Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:border-neutral-600 hover:text-white">View site <ExternalLink size={14} /></Link></header>;
}
