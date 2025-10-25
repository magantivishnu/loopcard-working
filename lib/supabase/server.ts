import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import { Database } from "@/lib/database.types"; // Assuming you have a types file

// Use React's 'cache' to ensure the client is only created once per request
export const createClient = cache(() => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This set method is used by Supabase to refresh the session.
            // It will throw when called from a Server Component.
            // This is safe to ignore if you are refreshing the session in middleware.
          }
        },
      },
    }
  );
});