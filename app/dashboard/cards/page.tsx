import DeleteCardButton from "@/components/delete-card-button";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";

export default async function Page() {
  const _supabase = await createServer();
  // Optionally preload user/session if needed
  // const { data: { user } } = await _supabase.auth.getUser();

  return (
    <div className="px-4 pb-8 pt-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create new card</h1>
      {/* Client-only wizard wrapper */}
      {/* @ts-expect-error Server Component passes nothing; wrapper runs client-side */}
      <ClientWrapper />
    </div>
  );
}
