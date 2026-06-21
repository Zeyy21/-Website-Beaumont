import { createClient } from "@/lib/supabase/server";
import { fallbackServices, rewards } from "@/lib/config";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface ServiceCard {
  id: string;
  name: string;
  description: string;
  base_price: number;
  rate_per_m2: number;
  multiplier: number;
}

/**
 * Public services are code-owned. Legacy Supabase rows previously replaced the
 * exterior-care catalogue with unrelated cleaning products in production.
 */
export async function getServices(): Promise<ServiceCard[]> {
  return fallbackServices.map(toCard);
}

function toCard(s: (typeof fallbackServices)[number]): ServiceCard {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    base_price: Number(s.base_price),
    rate_per_m2: Number(s.rate_per_m2),
    multiplier: Number(s.multiplier),
  };
}

/** Current authed user + profile, or null when signed out / no Supabase. */
export async function getCurrentUser(): Promise<{
  id: string;
  email: string | null;
  profile: ProfileRow | null;
} | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Resilience: if the signup DB trigger didn't create a profile row (e.g. it
  // wasn't installed), create it now so the dashboard never breaks. Best-effort.
  if (!profile) {
    const fullName =
      (user.user_metadata?.full_name as string | undefined) ?? null;
    const { data: created } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName }, { onConflict: "id" })
      .select("*")
      .single();
    profile = created ?? null;
  }

  if (profile) {
    const { data: ledger } = await supabase
      .from("rewards_ledger")
      .select("delta")
      .eq("user_id", user.id);
    const ledgerBalance = (ledger ?? []).reduce(
      (total, entry) => total + Number(entry.delta),
      0,
    );
    const syncedBalance = ledger?.length
      ? ledgerBalance
      : Math.max(profile.points_balance, rewards.signup);

    if (profile.points_balance !== syncedBalance) {
      await supabase
        .from("profiles")
        .update({ points_balance: syncedBalance })
        .eq("id", user.id);
      profile = { ...profile, points_balance: syncedBalance };
    }
  }

  return { id: user.id, email: user.email ?? null, profile: profile ?? null };
}

/** Featured before/after items for the marketing gallery (public read). */
export async function getFeaturedGallery() {
  const supabase = createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return data ?? [];
}
