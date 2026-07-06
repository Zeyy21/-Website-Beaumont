import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "./env";
import type { Database } from "./types";

/**
 * Server Supabase client (RSC / route handlers / server actions).
 * Returns null when not configured. Cookie writes are wrapped in try/catch so
 * it is safe to call from a Server Component (where cookies are read-only).
 */
export function createClient() {
  if (!supabaseConfigured) return null;

  const cookieStore = cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component without a writable cookie store.
          // Session refresh is handled in middleware, so this is safe to ignore.
        }
      },
    },
  });
}
