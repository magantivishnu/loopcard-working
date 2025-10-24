import { NextResponse } from "next/server";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/`);

  const supabase = await createServer(); // await required
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(`${origin}/`);
}
