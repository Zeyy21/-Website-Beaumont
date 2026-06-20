import { createClient } from "@/lib/supabase/server";
import type {
  QuoteRow,
  PaymentRow,
  ContractRow,
  RewardRow,
  GalleryRow,
  ReferralRow,
} from "@/lib/supabase/types";

export interface DashboardData {
  quotes: QuoteRow[];
  payments: PaymentRow[];
  contracts: ContractRow[];
  rewards: RewardRow[];
  referrals: ReferralRow[];
  gallery: GalleryRow[];
}

/** Loads everything the signed-in customer's dashboard needs in one place. */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = createClient();
  if (!supabase) {
    return {
      quotes: [],
      payments: [],
      contracts: [],
      rewards: [],
      referrals: [],
      gallery: [],
    };
  }

  const [quotes, payments, contracts, rewards, referrals, gallery] =
    await Promise.all([
      supabase
        .from("quotes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("contracts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("rewards_ledger")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase.from("referrals").select("*").eq("referrer_id", userId),
      supabase
        .from("gallery_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

  return {
    quotes: quotes.data ?? [],
    payments: payments.data ?? [],
    contracts: contracts.data ?? [],
    rewards: rewards.data ?? [],
    referrals: referrals.data ?? [],
    gallery: gallery.data ?? [],
  };
}
