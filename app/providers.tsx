"use client";

import { ReactNode } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

function getClient() {
  if (!supabase) {
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabase;
}

export const getSupabaseBrowser = getClient;

export default function Providers({ children }: { children: ReactNode }) {
  // Put any future Context providers here. For now just render children.
  return <>{children}</>;
}
