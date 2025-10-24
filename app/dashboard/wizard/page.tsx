import ClientWrapper from "./ClientWrapper";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";

// keep your ClientWrapper import if you have one
// import ClientWrapper from "./ClientWrapper";

export default async function Page() {
  const supabase = await createServer();
  // optional: preload session or user if needed
  // const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="px-4 pb-8 pt-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create new card</h1>
      {/* @ts-expect-error Server Component passes nothing; wizard runs client-side */}
      <ClientWrapper />
    </div>
  );
}
