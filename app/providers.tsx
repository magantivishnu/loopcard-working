// app/providers.tsx
"use client";
import { useState } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  useState(() => createBrowserClient());
  return <>{children}</>;
}
export const getSupabaseBrowser = createBrowserClient;
