/**
 * Hand-authored DB types matching supabase/migrations. Regenerate with the
 * Supabase CLI (`supabase gen types typescript`) once a project is linked.
 *
 * Row interfaces are declared standalone first, then assembled into `Database`,
 * so Insert/Update can reference them without the self-referential generic that
 * makes the supabase-js client infer `never`.
 */

export type QuoteStatus =
  | "draft"
  | "requested"
  | "sent"
  | "accepted"
  | "scheduled"
  | "completed";

export type QuoteNotificationStatus = "pending" | "sent" | "failed";

export type PaymentMethod = "card" | "transfer" | "cash";
export type PaymentStatus = "awaiting" | "paid" | "refunded";
export type ContractStatus = "draft" | "sent" | "signed";
export type UserRole = "customer" | "staff";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Quote line item. Index signature keeps it assignable to `Json` for inserts. */
export type LineItem = {
  label: string;
  amount: number;
  [key: string]: Json | undefined;
};

// NOTE: these are `type` aliases, not `interface`s, on purpose. supabase-js
// requires each table's Row/Insert/Update to be assignable to
// Record<string, unknown>; interfaces lack an implicit index signature and fail
// that constraint (the whole schema then infers `never`). Object type aliases
// satisfy it. This mirrors what `supabase gen types typescript` emits.

export type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  points_balance: number;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
};

export type ServiceRow = {
  id: string;
  name: string;
  description: string;
  base_price: number;
  rate_per_m2: number;
  multiplier: number;
  active: boolean;
  sort: number;
};

export type QuoteRow = {
  id: string;
  user_id: string | null;
  service_id: string | null;
  address: string | null;
  area_m2: number | null;
  frequency: string | null;
  line_items: Json;
  total: number;
  status: QuoteStatus;
  source_zone: string | null;
  requester_name: string | null;
  requester_email: string | null;
  account_email: string | null;
  requester_phone: string | null;
  service_name: string | null;
  conditional_services: Json;
  request_key: string | null;
  notification_status: QuoteNotificationStatus;
  notification_error: string | null;
  notification_sent_at: string | null;
  created_at: string;
};

export type ContractRow = {
  id: string;
  user_id: string;
  quote_id: string | null;
  terms: string;
  status: ContractStatus;
  signed_at: string | null;
  created_at: string;
};

export type PaymentRow = {
  id: string;
  user_id: string;
  quote_id: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  stripe_id: string | null;
  paid_at: string | null;
  created_at: string;
};

export type RewardRow = {
  id: string;
  user_id: string;
  delta: number;
  reason: string;
  created_at: string;
};

export type ReferralRow = {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: string;
  reward_granted: boolean;
  created_at: string;
};

export type GalleryRow = {
  id: string;
  user_id: string | null;
  service_id: string | null;
  before_url: string;
  after_url: string;
  caption: string | null;
  featured: boolean;
  created_at: string;
};

export type DoorTagScanRow = {
  id: string;
  zone: string | null;
  tag_id: string | null;
  landed_at: string;
  converted_quote_id: string | null;
};

/** Insert = required keys `Req` stay required; everything else optional. */
type Insert<T, Req extends keyof T = never> = Partial<T> & Pick<T, Req>;

type Table<Row, Ins, Upd = Partial<Row>> = {
  Row: Row;
  Insert: Ins;
  Update: Upd;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<ProfileRow, Insert<ProfileRow, "id">>;
      services: Table<ServiceRow, Insert<ServiceRow, "name">>;
      quotes: Table<QuoteRow, Insert<QuoteRow>>;
      contracts: Table<ContractRow, Insert<ContractRow, "user_id">>;
      payments: Table<PaymentRow, Insert<PaymentRow, "user_id" | "amount">>;
      rewards_ledger: Table<
        RewardRow,
        Insert<RewardRow, "user_id" | "delta" | "reason">
      >;
      referrals: Table<
        ReferralRow,
        Insert<ReferralRow, "referrer_id" | "referred_id">
      >;
      gallery_items: Table<
        GalleryRow,
        Insert<GalleryRow, "before_url" | "after_url">
      >;
      door_tag_scans: Table<DoorTagScanRow, Insert<DoorTagScanRow>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
