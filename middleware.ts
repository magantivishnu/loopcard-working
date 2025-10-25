import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect only /dashboard
  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    const login = new URL("/auth/signin", req.url);
    login.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return res;
}

// Do not match /auth/callback or root. Only guard dashboard.
export const config = {
  matcher: ["/dashboard/:path*"],
};
