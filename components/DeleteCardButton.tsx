// components/DeleteCardButton.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { deleteCard } from "@/app/actions/cards";

export default function DeleteCardButton({
  id,
  after = "refresh", // "refresh" | "to-dashboard"
}: {
  id: string;
  after?: "refresh" | "to-dashboard";
}) {
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const router = useRouter();

  const onDelete = async () => {
    const ok = window.confirm("Delete this card? This cannot be undone.");
    if (!ok) return;
    setBusy(true);
    setErr(null);
    const res = await deleteCard(id);
    setBusy(false);
    if (!res.ok) {
      setErr(res.message ?? "Delete failed");
      return;
    }
    if (after === "to-dashboard") router.push("/dashboard");
    else router.refresh();
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {err ? <p className="text-xs text-red-600">{err}</p> : null}
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        className="text-sm rounded border border-red-300 px-3 py-1 text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {busy ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
