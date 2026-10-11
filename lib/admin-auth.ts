import "server-only";

import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase";

export interface AuthorizedAdmin {
  id: string;
  email: string;
}

export function getConfiguredAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 0)
  );
}

export async function getCurrentAdmin(): Promise<AuthorizedAdmin | null> {
  try {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.auth.getUser();
    const email = data.user?.email?.trim().toLowerCase();
    if (error || !data.user || !email || !getConfiguredAdminEmails().has(email)) {
      return null;
    }
    return { id: data.user.id, email };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AuthorizedAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized: administrator access is required.");
  }
  return admin;
}

export async function isWhitelistedAdmin(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !getConfiguredAdminEmails().has(normalized)) return false;

  try {
    const client = createSupabaseAdminClient();
    const { data, error } = await client
      .from("admin_users")
      .select("email")
      .eq("email", normalized)
      .maybeSingle();
    if (error || typeof data?.email !== "string") return false;
    return data.email.trim().toLowerCase() === normalized;
  } catch {
    return false;
  }
}

export async function requireDatabaseWhitelistedAdmin(): Promise<AuthorizedAdmin> {
  const admin = await requireAdmin();
  if (!(await isWhitelistedAdmin(admin.email))) {
    throw new Error("Unauthorized: this account is not in the database admin allowlist.");
  }
  return admin;
}
