// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/app/providers";
import type { User } from "@supabase/supabase-js";
import type { UserResponse } from "@supabase/supabase-js";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function Page() {
  const supabase = getSupabaseBrowser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((result: UserResponse) => setUser(result.data.user ?? null));
    const {
  data: { subscription },
} = supabase.auth.onAuthStateChange(
  (_event: AuthChangeEvent, session: Session | null) => {
    setUser(session?.user ?? null);
  }
);
    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main style={{ padding: 16 }}>
      <h1>LoopCard</h1>
      {user ? (
        <>
          <p>Signed in as {user.email}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <button onClick={signInGoogle}>Sign in with Google</button>
        </>
      )}
    </main>
  );
}
