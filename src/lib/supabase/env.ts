/** Single place that decides whether Supabase is configured. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * True only when both public Supabase vars are present. The whole app reads
 * this to degrade gracefully (fallback data, disabled auth) when running with
 * an empty .env, see the "zero-key principle" in DEVELOPMENT_SPEC.md.
 */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
