// src/config/supabase.ts
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yvgkrzhmtuhtlrfehsxj.supabase.co"; // <-- your real project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z2tyemhtdHVodGxyZmVoc3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTY3NDUsImV4cCI6MjA3NzA3Mjc0NX0.WWbR7BBVzjLTc8SkJ1o7vOak88dXmticucSm__EAbhM"; // <-- your real anon key

// Avoid multiple instances in Fast Refresh
declare global {
  var __supabase__: SupabaseClient | undefined;
}

function makeClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export const supabase: SupabaseClient =
  global.__supabase__ ?? (global.__supabase__ = makeClient());
