import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Use in RSC or route handlers. Next 16: cookies() is async.
export async function createServerClientStrict() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          // In RSC, set may be ignored; in route handlers/server actions it works.
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

// Back-compat alias
export const createClient = createServerClientStrict;
