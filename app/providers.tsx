// app/providers.tsx
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  useState(() => supabase);
  return <>{children}</>;
}

// Export a function to get the Supabase client
export const getSupabaseBrowser = () => supabase;