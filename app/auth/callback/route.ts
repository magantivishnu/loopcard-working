// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClientStrict } from "@/lib/supabase/server";

// Handles the OAuth redirect and persists the session cookies
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = createServerClientStrict();

  // Exchange code for session and set cookies
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(`${origin}/`);
}
