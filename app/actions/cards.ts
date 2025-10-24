// app/actions/cards.ts
"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

function getClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );
}

function genSlug(seed?: string) {
  const s = (seed || "").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const rand = Math.random().toString(36).slice(2, 7);
  return s ? `${s}-${rand}` : `card-${rand}`;
}

export type CreateCardInput = {
  slug?: string | null;
  name?: string | null;
  business_name?: string | null;
  role?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  about?: string | null;
  address?: string | null;
  avatar_url?: string | null;
  theme?: string | null;
  links?: Array<{ label?: string; url?: string; icon?: string }> | null;
};

export async function createCard(input: CreateCardInput) {
  const supabase = getClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return { ok: false, message: "Not authenticated" as const };

  // Pick slug or generate one
  let slug = input.slug ?? null;
  if (!slug) slug = genSlug(input.name || input.business_name || undefined);

  const payload = {
    user_id: user.id,
    slug,
    name: input.name ?? null,
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
  };

  const { data, error } = await supabase.from("cards").insert(payload).select("id,slug").single();
  if (error) return { ok: false, message: error.message as const };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cards");
  return { ok: true as const, id: data.id as string, slug: data.slug as string };
}

// ---------- UPDATE (all optional) ----------
export type UpdateCardInput = { id: string } & CreateCardInput;

export async function updateCard(input: UpdateCardInput) {
  const supabase = getClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return { ok: false, message: "Not authenticated" as const };

  const { data: existing, error: fetchErr } = await supabase
    .from("cards")
    .select("id,user_id")
    .eq("id", input.id)
    .single();
  if (fetchErr || !existing) return { ok: false, message: "Card not found" as const };
  if (existing.user_id !== user.id) return { ok: false, message: "Forbidden" as const };

  const payload = {
    slug: input.slug ?? null,
    name: input.name ?? null,
    business_name: input.business_name ?? null,
    role: input.role ?? null,
    phone: input.phone ?? null,
    whatsapp: input.whatsapp ?? null,
    email: input.email ?? null,
    website: input.website ?? null,
    about: input.about ?? null,
    address: input.address ?? null,
    avatar_url: input.avatar_url ?? null,
    theme: input.theme ?? null,
    links: input.links ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error: upErr } = await supabase.from("cards").update(payload).eq("id", input.id);
  if (upErr) return { ok: false, message: upErr.message as const };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cards");
  return { ok: true as const, slug: payload.slug ?? undefined };
}

// ---------- DELETE ----------
export async function deleteCard(id: string) {
  const supabase = getClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return { ok: false, message: "Not authenticated" as const };

  const { data: existing, error: fetchErr } = await supabase
    .from("cards")
    .select("id,user_id")
    .eq("id", id)
    .single();
  if (fetchErr || !existing) return { ok: false, message: "Card not found" as const };
  if (existing.user_id !== user.id) return { ok: false, message: "Forbidden" as const };

  const { error: delErr } = await supabase.from("cards").delete().eq("id", id);
  if (delErr) return { ok: false, message: delErr.message as const };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cards");
  return { ok: true as const };
}
