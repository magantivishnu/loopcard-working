// app/dashboard/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import DeleteCardButton from "@/components/DeleteCardButton";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) redirect("/login");

  const { count: viewsCount } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("event_type", "view");

  const { data: cards } = await supabase
    .from("cards")
    .select("id, slug, name, business_name, role, avatar_url, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">Quick stats and your cards.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Total views</div>
          <div className="mt-1 text-2xl font-semibold">{viewsCount ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Cards</div>
          <div className="mt-1 text-2xl font-semibold">{cards?.length ?? 0}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Last updated</div>
          <div className="mt-1 text-sm">
            {cards && cards[0]?.updated_at ? new Date(cards[0].updated_at).toLocaleString() : "—"}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your cards</h2>
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
