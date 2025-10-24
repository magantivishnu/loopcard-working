// components/wizard/CardWizard.tsx
"use client";

import * as React from "react";
import UploadAvatar from "@/components/UploadAvatar";

type LinkItem = { label?: string; url?: string; icon?: string };

type FormValues = {
  slug: string;
  name: string;
  business_name: string;
  role: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  about: string;
  address: string;
  avatar_url: string; // public URL
  theme: string;
  links: LinkItem[];
};

type Props = {
  mode?: "create" | "edit";
  initialValues?: Partial<FormValues>;
  submitting?: boolean;
  onSubmit(values: FormValues): Promise<void> | void;
  onCancel?(): void;
};

export default function CardWizard({
  mode = "create",
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}: Props) {
  const [step, setStep] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);

  const [values, setValues] = React.useState<FormValues>(() => ({
    slug: initialValues?.slug ?? "",
    name: initialValues?.name ?? "",
    business_name: initialValues?.business_name ?? "",
    role: initialValues?.role ?? "",
    phone: initialValues?.phone ?? "",
    whatsapp: initialValues?.whatsapp ?? "",
    email: initialValues?.email ?? "",
    website: initialValues?.website ?? "",
    about: initialValues?.about ?? "",
    address: initialValues?.address ?? "",
    avatar_url: initialValues?.avatar_url ?? "",
    theme: initialValues?.theme ?? "default",
    links: initialValues?.links ?? [],
  }));

  const setField = <K extends keyof FormValues>(key: K, val: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  const addLink = () => setValues((v) => ({ ...v, links: [...v.links, { label: "", url: "", icon: "" }] }));
  const removeLink = (idx: number) =>
    setValues((v) => ({ ...v, links: v.links.filter((_, i) => i !== idx) }));
  const setLink = (idx: number, patch: Partial<LinkItem>) =>
    setValues((v) => ({
      ...v,
      links: v.links.map((lnk, i) => (i === idx ? { ...lnk, ...patch } : lnk)),
    }));

  const canPrev = step > 1;
  const canNext = step < 5;

  function handleNext() {
    setError(null);
    if (canNext) setStep((s) => s + 1);
  }
  function handlePrev() {
    setError(null);
    if (canPrev) setStep((s) => s - 1);
  }

  async function handleSave() {
    try {
      setError(null);
      await onSubmit(values); // no hard validation, all optional
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    }
  }

  const Title = mode === "edit" ? "Edit Card" : "Create Card";

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{Title}</h2>
        <p className="text-sm text-gray-500">Step {step} of 5</p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-2 flex-1 rounded-full ${n <= step ? "bg-blue-600" : "bg-gray-200"}`}
          />
        ))}
      </div>

      {error ? <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Full name" value={values.name} onChange={(v) => setField("name", v)} />
          <Field label="Business name" value={values.business_name} onChange={(v) => setField("business_name", v)} />
          <Field label="Role / designation" value={values.role} onChange={(v) => setField("role", v)} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="Phone" value={values.phone} onChange={(v) => setField("phone", v)} />
          <Field label="WhatsApp" value={values.whatsapp} onChange={(v) => setField("whatsapp", v)} />
          <Field label="Email" value={values.email} onChange={(v) => setField("email", v)} />
          <Field label="Website" value={values.website} onChange={(v) => setField("website", v)} hint="Include http:// or https://" />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <TextArea label="About" value={values.about} onChange={(v) => setField("about", v)} />
          <TextArea label="Address" value={values.address} onChange={(v) => setField("address", v)} />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Links</label>
            <button type="button" onClick={addLink} className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
              Add link
            </button>
          </div>
          <div className="space-y-3">
            {values.links.length === 0 ? (
              <p className="text-sm text-gray-500">Optional. Add social or website links.</p>
            ) : null}
            {values.links.map((lnk, i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Link #{i + 1}</span>
                  <button type="button" onClick={() => removeLink(i)} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Label" value={lnk.label ?? ""} onChange={(v) => setLink(i, { label: v })} />
                  <Field label="URL" value={lnk.url ?? ""} onChange={(v) => setLink(i, { url: v })} />
                  <Field label="Icon (optional)" value={lnk.icon ?? ""} onChange={(v) => setLink(i, { icon: v })} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Field label="Public slug" value={values.slug} onChange={(v) => setField("slug", v.toLowerCase())} hint="Used in /[slug]. Optional." />
          <Field label="Theme" value={values.theme} onChange={(v) => setField("theme", v)} hint="default | dark | ocean | sunrise" />
          <div className="space-y-2">
            <label className="block text-sm font-medium">Avatar</label>
            <UploadAvatar
              currentUrl={values.avatar_url}
              onUploaded={(url) => setField("avatar_url", url)}
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={handlePrev} disabled={!canPrev || submitting} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">
            Back
          </button>
          {onCancel ? (
            <button type="button" onClick={onCancel} disabled={submitting} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">
              Cancel
            </button>
          ) : null}
        </div>
        {step < 5 ? (
          <button type="button" onClick={handleNext} disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
            Next
          </button>
        ) : (
          <button type="button" onClick={handleSave} disabled={submitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
            {submitting ? "Saving…" : mode === "edit" ? "Save changes" : "Create card"}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  hint,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <textarea
        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </label>
  );
}
