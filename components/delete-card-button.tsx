"use client";

type Props = { id: string; after?: "to-dashboard" | string };

export default function DeleteCardButton({ id, after }: Props) {
  const onClick = async () => {
    try {
      const res = await fetch("/api/cards/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, after }),
      });
      if (!res.ok) throw new Error("Delete failed");
      const { redirectTo } = await res.json();
      if (redirectTo) window.location.href = redirectTo;
    } catch (e) {
      console.error(e);
      alert("Unable to delete card.");
    }
  };

  return (
    <button
      onClick={onClick}
      className="text-sm rounded border px-3 py-1 hover:bg-gray-50"
    >
      Delete
    </button>
  );
}
