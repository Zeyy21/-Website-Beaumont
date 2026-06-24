import { createClient } from "@/lib/supabase/server";
import { clientHref, clientKeyFromQuote } from "@/lib/admin-clients";
import type { PaymentRow, ProfileRow, QuoteRow } from "@/lib/supabase/types";

export interface AdminQuoteCard {
  quote: QuoteRow;
  clientKey: string | null;
  clientUrl: string | null;
  quoteUrl: string;
  previousQuote: QuoteRow | null;
  nextAction: string;
}

export interface AdminInboxData {
  cards: AdminQuoteCard[];
  counts: {
    needsQuote: number;
    sent: number;
    accepted: number;
    scheduled: number;
    completed: number;
  };
  awaitingPayments: PaymentRow[];
}

export interface AdminQuoteDetails {
  quote: QuoteRow;
  profile: ProfileRow | null;
  clientKey: string | null;
  clientUrl: string | null;
  history: QuoteRow[];
  previousQuote: QuoteRow | null;
  payments: PaymentRow[];
}

export function quoteHref(quoteId: string) {
  return `/admin/quotes/${quoteId}`;
}

export async function getAdminInboxData(): Promise<AdminInboxData> {
  const supabase = createClient();
  if (!supabase) {
    return {
      cards: [],
      counts: {
        needsQuote: 0,
        sent: 0,
        accepted: 0,
        scheduled: 0,
        completed: 0,
      },
      awaitingPayments: [],
    };
  }

  const [quotesResult, awaitingPayments] = await Promise.all([
    supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1500),
    supabase
      .from("payments")
      .select("*")
      .eq("status", "awaiting")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const quotes = quotesResult.data ?? [];
  const operationalQuotes = quotes.filter((quote) =>
    ["requested", "sent", "accepted", "scheduled"].includes(quote.status),
  );

  return {
    cards: operationalQuotes.map((quote) => makeCard(quote, quotes)),
    counts: {
      needsQuote: quotes.filter((quote) => quote.status === "requested").length,
      sent: quotes.filter((quote) => quote.status === "sent").length,
      accepted: quotes.filter((quote) => quote.status === "accepted").length,
      scheduled: quotes.filter((quote) => quote.status === "scheduled").length,
      completed: quotes.filter((quote) => quote.status === "completed").length,
    },
    awaitingPayments: awaitingPayments.data ?? [],
  };
}

export async function getAdminQuoteDetails(
  quoteId: string,
): Promise<AdminQuoteDetails | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .maybeSingle();
  if (!quote) return null;

  const email = quoteEmail(quote);
  const quoteQueries = [
    quote.user_id
      ? supabase
          .from("quotes")
          .select("*")
          .eq("user_id", quote.user_id)
          .order("created_at", { ascending: false })
      : null,
    email
      ? supabase
          .from("quotes")
          .select("*")
          .ilike("requester_email", email)
          .order("created_at", { ascending: false })
      : null,
    email
      ? supabase
          .from("quotes")
          .select("*")
          .ilike("account_email", email)
          .order("created_at", { ascending: false })
      : null,
  ].filter(Boolean);

  const [profileResult, paymentsResult, ...historyResults] = await Promise.all([
    quote.user_id
      ? supabase.from("profiles").select("*").eq("id", quote.user_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("payments")
      .select("*")
      .eq("quote_id", quote.id)
      .order("created_at", { ascending: false }),
    ...quoteQueries,
  ]);

  const history = uniqueById(
    [quote],
    ...historyResults.map((result) => result?.data ?? []),
  ).sort(sortByCreatedDesc);
  const clientKey = clientKeyFromQuote(quote);

  return {
    quote,
    profile: profileResult.data ?? null,
    clientKey,
    clientUrl: clientKey ? clientHref(clientKey) : null,
    history,
    previousQuote: findPreviousQuote(quote, history),
    payments: paymentsResult.data ?? [],
  };
}

export async function getAdminJobs() {
  const supabase = createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("quotes")
    .select("*")
    .in("status", ["accepted", "scheduled", "completed"])
    .order("scheduled_for", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(500);

  return data ?? [];
}

export async function getAdminPayments() {
  const supabase = createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  return data ?? [];
}

export function makeCard(quote: QuoteRow, allQuotes: QuoteRow[]): AdminQuoteCard {
  const clientKey = clientKeyFromQuote(quote);
  return {
    quote,
    clientKey,
    clientUrl: clientKey ? clientHref(clientKey) : null,
    quoteUrl: quoteHref(quote.id),
    previousQuote: findPreviousQuote(quote, allQuotes),
    nextAction: nextActionForQuote(quote),
  };
}

export function findPreviousQuote(quote: QuoteRow, history: QuoteRow[]) {
  const email = quoteEmail(quote);
  const address = normalize(quote.address);
  const service = normalize(quote.service_name);

  return (
    history
      .filter((candidate) => candidate.id !== quote.id)
      .filter((candidate) => Number(candidate.total) > 0)
      .filter((candidate) => {
        const sameUser = quote.user_id && candidate.user_id === quote.user_id;
        const sameEmail = email && quoteEmail(candidate) === email;
        return sameUser || sameEmail;
      })
      .filter((candidate) => {
        if (!address) return true;
        return normalize(candidate.address) === address;
      })
      .filter((candidate) => {
        if (!service) return true;
        return normalize(candidate.service_name) === service;
      })
      .sort(sortByCreatedDesc)[0] ?? null
  );
}

export function nextActionForQuote(quote: QuoteRow) {
  if (quote.status === "requested") {
    return Number(quote.total) > 0 ? "Send quote" : "Set final price";
  }
  if (quote.status === "sent") return "Follow up or mark accepted";
  if (quote.status === "accepted") return "Schedule job";
  if (quote.status === "scheduled") return "Complete job";
  if (quote.status === "completed") return "Done";
  return "Review";
}

export function quoteEmail(quote: Pick<QuoteRow, "account_email" | "requester_email">) {
  return normalize(quote.account_email ?? quote.requester_email);
}

function normalize(value?: string | null) {
  const clean = value?.trim().toLowerCase();
  return clean || null;
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
