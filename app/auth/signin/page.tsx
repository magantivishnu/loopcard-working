"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [err, setErr] = useState("");

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) router.replace("/dashboard");
      }
    );
    return () => listener.subscription.unsubscribe();
  }, [router]);

  const sendMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErr("");

    const redirectTo =
      window.location.origin + "/auth/callback?next=/dashboard";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setErr(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm border rounded-xl p-6 shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">Sign in</h1>

        <form onSubmit={sendMagic} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border rounded p-2"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full border rounded p-2 bg-black text-white"
          >
            {status === "sending" ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        {status === "sent" && (
          <p className="text-sm text-green-600 mt-4 text-center">
            Check your email for the login link.
          </p>
        )}
        {err && (
          <p className="text-sm text-red-600 mt-4 text-center">
            Error: {err}
          </p>
        )}
      </div>
    </main>
  );
}
