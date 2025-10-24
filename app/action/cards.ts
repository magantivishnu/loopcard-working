// app/actions/cards.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export type UpdateCardInput = {
  id: string;
  slug: string;
  name: string;
  business_name?: string;
  role?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  about?: string;
  address?: string;
  avatar_url?: string;
  theme?: string;
  links?: Array<{ label: string; url: string; icon?: string }>;
};

export async function updateCard(input: UpdateCardInput) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return { ok: false, message: "Not authenticated" as const };
  }

  // Ensure ownership
  const { data: existing, error: fetchErr } = await supabase
    .from("cards")
    .select("id,user_id")
    .eq("id", input.id)
    .single();

  if (fetchErr || !existing) {
    return { ok: false, message: "Card not found" as const };
  }
  if (existing.user_id !== user.id) {
    return { ok: false, message: "Forbidden" as const };
  }

  const payload = {
    slug: input.slug,
    name: input.name,
    business_name: input.business_name ?? null,
    role: input.role ?? null,
    phone: input.phone ?? null,
    whatsapp: input.whatsapp ?? null,
    email: input.email ?? null,
    website: input.website ?? null,
    about: input.about ?? null,
    address: input.address ?? null,
    avatar_url: input.avatar_url ?? null,
    theme: input.theme ?? "default",
    links: input.links ?? [],
    updated_at: new Date().toISOString(),
  };

  const { error: upErr } = await supabase.from("cards").update(payload).eq("id", input.id);

  if (upErr) {
    return { ok: false, message: upErr.message as const };
  }
  return { ok: true as const, slug: input.slug };
}
