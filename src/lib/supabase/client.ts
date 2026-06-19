"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "./env";
import type { Database } from "./types";

/**
 * Browser Supabase client. Returns null when not configured so callers can
 * show a friendly "connect Supabase to enable accounts" state instead of
 * crashing on an empty .env.
 */
export function createClient() {
  if (!supabaseConfigured) return null;
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
