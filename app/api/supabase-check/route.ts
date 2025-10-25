import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_ANON_KEY || "";
  const envLoaded = Boolean(url && key);

  if (!envLoaded) {
    return NextResponse.json({ ok: false, envLoaded }, { status: 500 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Connectivity check that does not depend on your DB RLS
  const { data, error } = await supabase.auth.getSession();

  return NextResponse.json({
    ok: !error,
    envLoaded,
    sessionCheck: error ? "failed" : "passed",
  }, { status: error ? 500 : 200 });
}
