// app/dashboard/cards/[id]/edit/page.tsx
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import EditCardWizard from "@/components/wizard/EditCardWizard";
import DeleteCardButton from "@/components/DeleteCardButton";

type PageProps = { params: { id: string } };

export default async function Page({ params }: PageProps) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) redirect("/login");

  const { data: card, error } = await supabase.from("cards").select("*").eq("id", params.id).single();
  if (error || !card) notFound();
  if (card.user_id !== user.id) redirect("/dashboard");

  const initial = {
    id: card.id,
    slug: card.slug ?? "",
    name: card.name ?? "",
    business_name: card.business_name ?? "",
    role: card.role ?? "",
    phone: card.phone ?? "",
    whatsapp: card.whatsapp ?? "",
    email: card.email ?? "",
    website: card.website ?? "",
    about: card.about ?? "",
    address: card.address ?? "",
    avatar_url: card.avatar_url ?? "",
    theme: card.theme ?? "default",
    links: card.links ?? [],
  };

  return (
    <div className="px-4 pb-8 pt-4 max-w-3xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit card</h1>
        <DeleteCardButton id={card.id} after="to-dashboard" />
      </div>
      <EditCardWizard initialCard={initial} />
    </div>
  );
}
