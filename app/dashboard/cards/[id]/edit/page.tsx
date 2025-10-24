import { notFound } from "next/navigation";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";
import DeleteCardButton from "@/components/delete-card-button";
import EditCardWizard from "@/components/edit-card-wizard";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createServer();

  const { data: card, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !card) notFound();

  const initial = card;

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
