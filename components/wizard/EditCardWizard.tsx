// components/wizard/EditCardWizard.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateCard, type UpdateCardInput } from "@/app/actions/cards";

// Assumes you already have a reusable wizard component:
//   - <CardWizard initialValues onSubmit mode="edit" />
// It should enforce required fields exactly as in create mode.
import CardWizard from "@/components/wizard/CardWizard";

type Props = {
  initialCard: {
    id: string;
    slug: string;
    name: string;
    business_name?: string;
    role?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    website?: string;
    about?: string;
    address?: string;
    avatar_url?: string;
    theme?: string;
    links?: Array<{ label: string; url: string; icon?: string }>;
  };
};

export default function EditCardWizard({ initialCard }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (values: Omit<UpdateCardInput, "id">) => {
    setSubmitting(true);
    setError(null);
    const res = await updateCard({ id: initialCard.id, ...values });
    setSubmitting(false);

    if (!res.ok) {
      setError(res.message ?? "Update failed");
      return;
    }
    // Go to the public card or dashboard after save
    router.push(`/${res.slug}`);
  };

  return (
    <div className="rounded-2xl border p-4">
      {error ? (
        <div className="mb-3 text-sm text-red-600">{error}</div>
      ) : null}
      <CardWizard
        mode="edit"
        initialValues={{
          slug: initialCard.slug,
          name: initialCard.name,
          business_name: initialCard.business_name ?? "",
          role: initialCard.role ?? "",
          phone: initialCard.phone ?? "",
          whatsapp: initialCard.whatsapp ?? "",
          email: initialCard.email ?? "",
          website: initialCard.website ?? "",
          about: initialCard.about ?? "",
          address: initialCard.address ?? "",
          avatar_url: initialCard.avatar_url ?? "",
          theme: initialCard.theme ?? "default",
          links: initialCard.links ?? [],
        }}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard")}
      />
    </div>
  );
}
