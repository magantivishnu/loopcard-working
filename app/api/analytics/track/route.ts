// app/api/analytics/track/route.ts
import { NextResponse } from "next/server";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServer();
  const body = await request.json();

  // example no-op
  await supabase.from("analytics_events").insert({
    type: body?.type ?? "unknown",
    payload: body ?? {},
  });

  return NextResponse.json({ ok: true });
}
