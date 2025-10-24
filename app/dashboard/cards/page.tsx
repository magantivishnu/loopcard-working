// app/dashboard/cards/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import DeleteCardButton from "@/components/DeleteCardButton";

export default async function CardsPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get: (n: string) => cookieStore.get(n)?.value },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cards, error } = await supabase
    .from("cards")
    .select("id, slug, name, business_name, role, avatar_url, updated_at, created_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-semibold">Your cards</h1>
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your cards</h1>
        <Link href="/dashboard/wizard" className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
          Create new
        </Link>
      </div>

      {(!cards || cards.length === 0) ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">No cards yet. Click “Create new” to add one.</div>
      ) : (
        <div className="divide-y rounded-lg border">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {card.avatar_url ? (
                  <img src={card.avatar_url} alt={card.name ?? ""} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                )}
                <div>
                  <div className="font-medium">{card.name ?? card.business_name ?? `/${card.slug ?? ""}`}</div>
                  <div className="text-xs text-gray-500">
                    {card.business_name ? `${card.business_name} • ` : ""}
                    {card.slug ? `/${card.slug}` : "no slug"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {card.slug ? (
                  <Link href={`/${card.slug}`} className="text-sm rounded border px-3 py-1 hover:bg-gray-50">View</Link>
                ) : null}
                <Link href={`/dashboard/cards/${card.id}/edit`} className="text-sm rounded border px-3 py-1 hover:bg-gray-50">Edit</Link>
                <DeleteCardButton id={card.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
