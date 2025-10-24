import { notFound } from "next/navigation";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";
import EditCardForm from "./EditCardForm";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createServer();

  const { data: card, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !card) notFound();

  return <EditCardForm card={card} />;
}
