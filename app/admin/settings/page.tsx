import Link from "next/link";
import { redirect } from "next/navigation";
import { Settings2, ExternalLink } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return (
    <div className="space-y-6">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-400">Configuration</p><h1 className="mt-2 flex items-center gap-3 text-3xl font-black"><Settings2 size={28} className="text-pink-400"/> Site settings</h1><p className="mt-2 text-sm text-neutral-400">Deployment and integration settings.</p></div>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6"><p className="text-sm text-neutral-400">Signed in as</p><p className="mt-1 font-semibold">{admin.email}</p><h2 className="mt-6 font-bold">Deployment configuration</h2><p className="mt-2 text-sm leading-6 text-neutral-400">Manage site URL, Supabase credentials, admin allowlist, TMDB configuration and contact details through your hosting provider's environment-variable settings. After changing values, redeploy or restart the application. Secret values are not displayed or edited here.</p><p className="mt-3 text-sm leading-6 text-neutral-400">Make sure required environment variables are configured before enabling public features. Do not expose server-only keys in browser code.</p></section>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><h2 className="font-bold">Quick links</h2><div className="mt-3 grid gap-3 sm:grid-cols-2"><Link href="/admin/ads" className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4 hover:border-pink-500/60"><span><span className="block font-semibold">Ads configuration</span><span className="mt-1 block text-sm text-neutral-500">Manage ad client and slots</span></span><ExternalLink size={17} className="text-pink-400"/></Link><Link href="/admin/analytics" className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-4 hover:border-pink-500/60"><span><span className="block font-semibold">Site analytics</span><span className="mt-1 block text-sm text-neutral-500">Review content and redirect metrics</span></span><ExternalLink size={17} className="text-pink-400"/></Link></div></section>
    </div>
  );
}
