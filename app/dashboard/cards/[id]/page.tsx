import { notFound } from "next/navigation";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: card, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !card) notFound();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">{card.name ?? `Card ${card.id}`}</h1>
      <div className="text-sm text-gray-600">/{card.slug ?? "no-slug"}</div>
    </div>
  );
}
