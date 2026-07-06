import { createClient } from "@/lib/supabase/server";
import type {
  ContractRow,
  PaymentRow,
  ProfileRow,
  QuoteRow,
  ReferralRow,
  RewardRow,
} from "@/lib/supabase/types";

const emailKeyPrefix = "email:";
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface AdminClientSummary {
  key: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: ProfileRow["role"] | "quote-only";
  profileId: string | null;
  pointsBalance: number | null;
  quoteCount: number;
  totalQuoted: number;
  latestQuoteAt: string | null;
  latestAddress: string | null;
  latestService: string | null;
  latestStatus: QuoteRow["status"] | null;
  latestTotal: number | null;
  paymentCount: number;
  paidTotal: number;
  lastPaymentAt: string | null;
  createdAt: string | null;
}

export interface AdminClientDetails {
  summary: AdminClientSummary;
  profile: ProfileRow | null;
  quotes: QuoteRow[];
  payments: PaymentRow[];
  contracts: ContractRow[];
  rewards: RewardRow[];
  referrals: ReferralRow[];
}

export function clientKeyFromQuote(
  quote: Pick<QuoteRow, "user_id" | "requester_email" | "account_email">,
) {
  if (quote.user_id) return quote.user_id;
  const email = normalizeEmail(quote.account_email ?? quote.requester_email);
  return email ? `${emailKeyPrefix}${email}` : null;
}

export function clientHref(key: string) {
  return `/admin/clients/${encodeURIComponent(key)}`;
}

export async function getAdminClientSummaries(search = "") {
  const supabase = createClient();
  if (!supabase) return [];

  const [profiles, quotes, payments] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1500),
    supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1500),
  ]);

  const summaries = summarizeClients(
    profiles.data ?? [],
    quotes.data ?? [],
    payments.data ?? [],
  );

  const term = search.trim().toLowerCase();
  if (!term) return summaries;

  return summaries.filter((client) =>
    [
      client.name,
      client.email,
      client.phone,
      client.latestAddress,
      client.latestService,
      client.latestStatus,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
}

export async function getAdminClientDetails(rawKey: string) {
  const supabase = createClient();
  if (!supabase) return null;

  const key = safeDecode(rawKey);
  const profileId = uuidPattern.test(key) ? key : null;
  const emailKey = key.startsWith(emailKeyPrefix)
    ? key.slice(emailKeyPrefix.length)
    : null;

  let profile: ProfileRow | null = null;
  let quotes: QuoteRow[] = [];
  let payments: PaymentRow[] = [];
  let contracts: ContractRow[] = [];
  let rewards: RewardRow[] = [];
  let referrals: ReferralRow[] = [];

  if (profileId) {
    const [
      profileResult,
      quoteResult,
      paymentResult,
      contractResult,
      rewardResult,
      referralsSent,
      referralsReceived,
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", profileId).maybeSingle(),
      supabase
        .from("quotes")
        .select("*")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false }),
      supabase
        .from("payments")
        .select("*")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false }),
      supabase
        .from("contracts")
        .select("*")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false }),
      supabase
        .from("rewards_ledger")
        .select("*")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false }),
      supabase.from("referrals").select("*").eq("referrer_id", profileId),
      supabase.from("referrals").select("*").eq("referred_id", profileId),
    ]);

    profile = profileResult.data ?? null;
    quotes = quoteResult.data ?? [];
    payments = paymentResult.data ?? [];
    contracts = contractResult.data ?? [];
    rewards = rewardResult.data ?? [];
    referrals = uniqueById(referralsSent.data ?? [], referralsReceived.data ?? []);
  } else if (emailKey) {
    const email = normalizeEmail(emailKey);
    if (!email) return null;

    const [profileResult, requesterQuotes, accountQuotes] = await Promise.all([
      supabase.from("profiles").select("*").eq("email", email).maybeSingle(),
      supabase
        .from("quotes")
        .select("*")
        .ilike("requester_email", email)
        .order("created_at", { ascending: false }),
      supabase
        .from("quotes")
        .select("*")
        .ilike("account_email", email)
        .order("created_at", { ascending: false }),
    ]);

    profile = profileResult.data ?? null;
    quotes = uniqueById(requesterQuotes.data ?? [], accountQuotes.data ?? []).sort(
      sortByCreatedDesc,
    );

    const quoteIds = quotes.map((quote) => quote.id);
    if (quoteIds.length) {
      const paymentResult = await supabase
        .from("payments")
        .select("*")
        .in("quote_id", quoteIds)
        .order("created_at", { ascending: false });
      payments = paymentResult.data ?? [];
    }
  } else {
    return null;
  }

  const [summary] = summarizeClients(
    profile ? [profile] : [],
    quotes,
    payments,
  );

  if (!summary) return null;

  return {
    summary,
    profile,
    quotes,
    payments,
    contracts,
    rewards,
    referrals,
  } satisfies AdminClientDetails;
}

function summarizeClients(
  profiles: ProfileRow[],
  quotes: QuoteRow[],
  payments: PaymentRow[],
) {
  const summaries = new Map<string, AdminClientSummary>();
  const profileIdByEmail = new Map<string, string>();

  for (const profile of profiles) {
    const email = normalizeEmail(profile.email);
    if (email) profileIdByEmail.set(email, profile.id);
    summaries.set(profile.id, {
      key: profile.id,
      name: profile.full_name || email || "Client",
      email,
      phone: profile.phone,
      role: profile.role,
      profileId: profile.id,
      pointsBalance: profile.points_balance,
      quoteCount: 0,
      totalQuoted: 0,
      latestQuoteAt: null,
      latestAddress: null,
      latestService: null,
      latestStatus: null,
      latestTotal: null,
      paymentCount: 0,
      paidTotal: 0,
      lastPaymentAt: null,
      createdAt: profile.created_at,
    });
  }

  for (const quote of quotes) {
    const quoteEmail = normalizeEmail(quote.account_email ?? quote.requester_email);
    const key =
      quote.user_id ??
      (quoteEmail ? profileIdByEmail.get(quoteEmail) ?? `${emailKeyPrefix}${quoteEmail}` : null);
    if (!key) continue;

    const summary = ensureSummary(summaries, key, quote);
    summary.quoteCount += 1;
    const total = Number(quote.total || 0);
    if (total > 0) summary.totalQuoted += total;
    if (!summary.email) {
      summary.email = quoteEmail;
    }
    if (!summary.phone) summary.phone = quote.requester_phone;
    if (summary.name === "Client" && quote.requester_name) {
      summary.name = quote.requester_name;
    }

    if (isNewer(quote.created_at, summary.latestQuoteAt)) {
      summary.latestQuoteAt = quote.created_at;
      summary.latestAddress = quote.address;
      summary.latestService = quote.service_name;
      summary.latestStatus = quote.status;
      summary.latestTotal = total > 0 ? total : null;
    }
  }

  for (const payment of payments) {
    const summary = payment.user_id ? summaries.get(payment.user_id) : null;
    if (!summary) continue;

    summary.paymentCount += 1;
    if (payment.status === "paid") summary.paidTotal += Number(payment.amount || 0);
    if (isNewer(payment.created_at, summary.lastPaymentAt)) {
      summary.lastPaymentAt = payment.created_at;
    }
  }

  return Array.from(summaries.values()).sort((a, b) => {
    const aDate = Date.parse(a.latestQuoteAt ?? a.createdAt ?? "0");
    const bDate = Date.parse(b.latestQuoteAt ?? b.createdAt ?? "0");
    return bDate - aDate;
  });
}

function ensureSummary(
  summaries: Map<string, AdminClientSummary>,
  key: string,
  quote: QuoteRow,
) {
  const existing = summaries.get(key);
  if (existing) return existing;

  const email = normalizeEmail(quote.account_email ?? quote.requester_email);
  const summary: AdminClientSummary = {
    key,
    name: quote.requester_name || email || "Client",
    email,
    phone: quote.requester_phone,
    role: "quote-only",
    profileId: quote.user_id,
    pointsBalance: null,
    quoteCount: 0,
    totalQuoted: 0,
    latestQuoteAt: null,
    latestAddress: null,
    latestService: null,
    latestStatus: null,
    latestTotal: null,
    paymentCount: 0,
    paidTotal: 0,
    lastPaymentAt: null,
    createdAt: null,
  };
  summaries.set(key, summary);
  return summary;
}

function normalizeEmail(value?: string | null) {
  const email = value?.trim().toLowerCase();
  return email || null;
}

function isNewer(candidate: string | null, current: string | null) {
  if (!candidate) return false;
  if (!current) return true;
  return Date.parse(candidate) > Date.parse(current);
}

function sortByCreatedDesc(a: { created_at: string }, b: { created_at: string }) {
  return Date.parse(b.created_at) - Date.parse(a.created_at);
}

function uniqueById<T extends { id: string }>(...groups: T[][]) {
  const map = new Map<string, T>();
  for (const group of groups) {
    for (const item of group) map.set(item.id, item);
  }
  return Array.from(map.values());
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
