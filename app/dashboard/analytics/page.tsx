import { createServerClientStrict as createServer } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p className="p-4 text-sm">You are not signed in.</p>;

  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .select("*");

  if (cardsError) {
    return (
      <div className="p-4 text-red-600 text-sm">
        {cardsError.message}
      </div>
    );
  }

  const { data: analytics } = await supabase
    .from("analytics_events")
    .select("*");

  const totalViews =
    cards?.reduce((sum: number, c: any) => sum + (c.total_views || 0), 0) || 0;

  const uniqueViews =
    cards?.reduce((sum: number, c: any) => sum + (c.unique_views || 0), 0) || 0;

  const recentViews =
    analytics?.filter((e: any) => e.created_at)?.slice(0, 10) || [];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Analytics Overview</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded border p-4 text-sm">
          <div className="text-gray-500">Total Views</div>
          <div className="text-lg font-medium">{totalViews}</div>
        </div>
        <div className="rounded border p-4 text-sm">
          <div className="text-gray-500">Unique Views</div>
          <div className="text-lg font-medium">{uniqueViews}</div>
        </div>
      </div>

      <div className="rounded border p-4 text-sm">
        <h2 className="font-medium mb-2">Recent Views</h2>
        {recentViews.length === 0 ? (
          <p className="text-gray-500">No data yet.</p>
        ) : (
          <ul className="list-disc pl-4 space-y-1">
            {recentViews.map((e: any, i: number) => (
              <li key={i}>{JSON.stringify(e)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
