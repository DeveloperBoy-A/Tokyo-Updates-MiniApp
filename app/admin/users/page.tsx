import { redirect } from "next/navigation";
import { Users, ShieldCheck } from "lucide-react";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  let users: Array<{ id: string; email?: string | null; role?: string | null; created_at?: string | null }> = [];
  let issue = "";
  try {
    const result = await createSupabaseAdminClient()
      .from("profiles")
      .select("id,email,role,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (result.error) issue = result.error.message;
    else users = (result.data ?? []) as typeof users;
  } catch (reason: unknown) {
    issue = reason instanceof Error ? reason.message : "Unable to load user profiles.";
  }

  const dateLabel = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
  };

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-400">Administration</p><h1 className="mt-2 text-3xl font-black">Users</h1><p className="mt-2 text-sm text-neutral-400">Browse user profiles stored in Supabase. This page does not change user accounts.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><div className="flex items-center gap-3 text-neutral-400"><Users size={18}/><span className="text-sm">Profiles loaded</span></div><p className="mt-3 text-3xl font-black">{users.length}</p><p className="mt-1 text-xs text-neutral-500">Up to 200 most recent records</p></div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"><div className="flex items-center gap-3 text-neutral-400"><ShieldCheck size={18}/><span className="text-sm">Signed-in admin</span></div><p className="mt-3 break-all text-lg font-bold">{admin.email}</p><p className="mt-1 text-xs text-neutral-500">Admin access verified</p></div>
      </div>
      {issue ? <div role="alert" className="rounded-xl border border-amber-900 bg-amber-950/30 p-5 text-sm text-amber-200"><p className="font-semibold">Could not load profiles</p><p className="mt-1 break-words">{issue}</p><p className="mt-2 text-amber-300/80">Check that the Supabase profiles table has id, email, role, and created_at columns.</p></div> : <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        <div className="border-b border-neutral-800 px-5 py-4"><h2 className="font-bold">User profiles</h2><p className="mt-1 text-xs text-neutral-500">Sorted newest first</p></div>
        {users.length === 0 ? <div className="p-10 text-center text-sm text-neutral-500">No profiles found.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-neutral-950 text-xs uppercase tracking-wider text-neutral-500"><tr><th className="px-5 py-3 font-semibold">Email</th><th className="px-5 py-3 font-semibold">Role</th><th className="px-5 py-3 font-semibold">Joined</th><th className="px-5 py-3 font-semibold">User ID</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-neutral-800"><td className="px-5 py-4 font-medium">{user.email || "No email"}</td><td className="px-5 py-4"><span className="rounded-lg border border-neutral-700 px-2 py-1 text-xs">{user.role || "user"}</span></td><td className="whitespace-nowrap px-5 py-4 text-neutral-400">{dateLabel(user.created_at)}</td><td className="max-w-56 break-all px-5 py-4 font-mono text-xs text-neutral-500">{user.id}</td></tr>)}</tbody></table></div>}
      </div>}
    </div>
  );
}
