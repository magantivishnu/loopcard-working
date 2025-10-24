// app/dashboard/wizard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import CardWizard from "@/components/wizard/CardWizard";
import { createCard } from "@/app/actions/cards";

export default async function NewCardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  );

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect("/login");

  async function Action(form: any) {
    "use server";
    // Not used. We submit from client in the wizard.
  }

  return (
    <div className="px-4 pb-8 pt-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create new card</h1>
      {/* Client: call createCard on save */}
      {/* @ts-expect-error Server Component passes nothing; wizard runs client-side */}
      <ClientWrapper />
    </div>
  );
}

// Isolated client wrapper so we can call server actions from the wizard
function ClientWrapper() {
  // eslint-disable-next-line @next/next/no-async-client-component
  return (
    <CardWizard
      mode="create"
      initialValues={{}}
      submitting={false}
      onSubmit={async (values) => {
        const res = await createCard(values);
        if (res.ok && res.slug) {
          window.location.href = `/${res.slug}`;
        } else {
          alert(res.message || "Create failed");
        }
      }}
      onCancel={() => (window.location.href = "/dashboard")}
    />
  );
}
