import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function configuredAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0)
  );
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("reason", "configuration");
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  try {
    const { data, error } = await supabase.auth.getUser();
    const email = data.user?.email?.trim().toLowerCase();
    const allowedAdmins = configuredAdminEmails();

    if (error || !email || !allowedAdmins.has(email)) {
      await supabase.auth.signOut().catch(() => undefined);
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("reason", email ? "not-authorized" : "session");
      return NextResponse.redirect(loginUrl);
    }

    return response;
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("reason", "auth-error");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"]
};
