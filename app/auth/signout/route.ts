import { NextResponse } from "next/server";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createServer(); // await required on Next 16
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
