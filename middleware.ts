import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // If a Supabase code appears on any path, send it to /auth/callback
  if (url.searchParams.has("code") && url.pathname !== "/auth/callback") {
    const dest = new URL("/auth/callback", url);
    // preserve all query params
    url.searchParams.forEach((v, k) => dest.searchParams.set(k, v));
    return NextResponse.redirect(dest);
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard
  if (url.pathname.startsWith("/dashboard") && !session) {
    const login = new URL("/auth/signin", url);
    login.searchParams.set("next", url.pathname);
    return NextResponse.redirect(login);
  }

  return res;
}

// Match all routes except Next static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
