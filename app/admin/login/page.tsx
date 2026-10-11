"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });
      if (signInError) throw signInError;
      router.replace("/admin");
      router.refresh();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in. Check your Supabase configuration.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg py-6 sm:py-12">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl sm:p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-pink-600/15 text-pink-400"><ShieldCheck size={28} /></div>
        <p className="mt-5 text-center text-xs font-bold uppercase tracking-[.25em] text-pink-400">Restricted area</p>
        <h1 className="mt-2 text-center text-3xl font-black">Admin sign in</h1>
        <p className="mt-3 text-center text-sm leading-6 text-neutral-400">Use your Supabase Auth credentials. Only emails configured in <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-200">ADMIN_EMAILS</code> can access the dashboard.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-neutral-300">Email address</span><span className="flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-950 px-3 focus-within:border-pink-500"><Mail size={18} className="text-neutral-500" /><input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-neutral-600" /></span></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-neutral-300">Password</span><span className="flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-950 px-3 focus-within:border-pink-500"><LockKeyhole size={18} className="text-neutral-500" /><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-neutral-600" /></span></label>
          {error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-pink-600 px-4 py-3 font-bold text-white transition hover:bg-pink-500 disabled:cursor-wait disabled:opacity-60">{busy ? "Signing in…" : "Sign in securely"}</button>
        </form>
        <p className="mt-5 text-center text-xs text-neutral-500">Need access? Ask the site owner to configure your admin email.</p>
        <Link href="/" className="mt-5 block text-center text-sm text-neutral-400 hover:text-white">← Back to website</Link>
      </div>
    </div>
  );
}
