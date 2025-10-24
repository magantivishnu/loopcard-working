"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

export async function createCard(payload: any) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("cards")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export type UpdateCardInput = {
  id: string;
  name?: string | null;
  business_name?: string | null;
  role?: string | null;
  email?: string | null;
  slug?: string | null;
  avatar_url?: string | null;
  is_active?: boolean | null;
};

export async function updateCard(input: UpdateCardInput) {
  const { id, ...fields } = input;
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("cards")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
