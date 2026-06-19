import { createClient } from "@/lib/supabase/server";
import { fallbackServices } from "@/lib/config";
import type { Database } from "@/lib/supabase/types";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface ServiceCard {
  id: string;
  name: string;
  description: string;
  base_price: number;
  rate_per_m2: number;
  multiplier: number;
}

/** Services from Supabase if configured, else the bundled fallback catalogue. */
export async function getServices(): Promise<ServiceCard[]> {
  const supabase = createClient();
  if (!supabase) return fallbackServices.map(toCard);

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort", { ascending: true });

  if (error || !data?.length) return fallbackServices.map(toCard);
  return data.map(toCard);
}

function toCard(s: ServiceRow | (typeof fallbackServices)[number]): ServiceCard {
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
