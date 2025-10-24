// components/UploadAvatar.tsx
"use client";

import * as React from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadAvatar({
  currentUrl,
  onUploaded,
  bucket = "avatars",
}: {
  currentUrl?: string;
  onUploaded: (publicUrl: string) => void;
  bucket?: string;
}) {
  const [preview, setPreview] = React.useState<string | undefined>(currentUrl);
  const [busy, setBusy] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  async function handleFile(file?: File) {
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setBusy(true);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    
    const path = `uploads/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (upErr) {
      setBusy(false);
      alert(`Upload failed: ${upErr.message}`);
      return;
    }

    // Switch to permanent public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = data.publicUrl;
    setPreview(publicUrl);
    onUploaded(publicUrl);
    setBusy(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {preview ? (
          <img src={preview} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload image"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <p className="text-xs text-gray-500">Preview shows instantly, then updates to the saved URL.</p>
    </div>
  );
}
