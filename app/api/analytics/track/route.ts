import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
export async function POST(request: Request) {
  const supabase = await createServer(); // await is required
  const body = await request.json();

  await supabase.from("analytics_events").insert({
    type: body?.type ?? "unknown",
    payload: body ?? {},
  });

  return NextResponse.json({ ok: true });
}
