"use client";

import { useSearchParams } from "next/navigation";

export default function HomeClient() {
  // Access params if needed later
  const _params = useSearchParams();
  // Minimal UI to unblock build; replace with your previous home JSX later.
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">LoopCard</h1>
      <p className="text-sm text-gray-600">Home loaded.</p>
    </main>
  );
}
