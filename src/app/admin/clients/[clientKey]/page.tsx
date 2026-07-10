import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Card, CardTitle, EmptyState, StatusBadge } from "@/components/dashboard-ui";
import { ButtonLink } from "@/components/ui";
import { getAdminClientDetails } from "@/lib/admin-clients";
import { quoteHref } from "@/lib/admin-quotes";
import { formatCurrency } from "@/lib/pricing";
import { quoteScopeDetails, visibleLineItems } from "@/lib/quote-scope";
import { saveClientNotesForm } from "@/app/admin/actions";
import type {
  ContractRow,
  Json,
  PaymentRow,
  QuoteRow,
  ReferralRow,
  RewardRow,
} from "@/lib/supabase/types";
import { getDict } from "@/lib/i18n/server";
import { statusLabel } from "@/lib/i18n/dictionaries";

export function generateMetadata() {
  return { title: `${getDict().admin.nav.clients}${getDict().common.brandSuffix}` };
}

export default async function AdminClientDetailPage({
  params,
}: {
  params: { clientKey: string };
}) {
  const dict = getDict();
  const t = dict.admin.clientDetail;
  const details = await getAdminClientDetails(params.clientKey);
  if (!details) notFound();

  const { summary, profile, quotes, payments, contracts, rewards, referrals } =
    details;
  const pricedQuotes = quotes
    .filter((quote) => Number(quote.total) > 0)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const referenceQuote = pricedQuotes[0] ?? null;
  const paidTotal = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/clients" className="text-sm text-cinnamon hover:underline">
            {t.backToClients}
          </Link>
          <h1 className="mt-2 font-display text-4xl text-oak">{summary.name}</h1>
          <p className="mt-1 text-sm text-soil/55">
            {summary.email ?? dict.admin.clients.noEmail}
            {summary.phone ? ` - ${summary.phone}` : ""}
          </p>
        </div>
        <ButtonLink href="/admin" variant="outline" size="sm">
          {t.openRequests}
        </ButtonLink>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryTile label={t.quotes} value={String(quotes.length)} />
        <SummaryTile label={t.quotedValue} value={formatCurrency(summary.totalQuoted)} />
        <SummaryTile label={t.paid} value={formatCurrency(paidTotal)} />
        <SummaryTile
          label={t.points}
          value={
            typeof summary.pointsBalance === "number"
              ? String(summary.pointsBalance)
              : "N/A"
          }
        />
      </section>

      <section>
        <CardTitle>{t.quoteReference}</CardTitle>
        <Card className="mt-4">
          {referenceQuote ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
                    {t.latestPriced}
                  </p>
                  <p className="mt-2 font-display text-4xl text-oak">
                    {formatCurrency(Number(referenceQuote.total))}
                  </p>
                  <p className="mt-1 text-sm text-soil/60">
                    {t.referenceHint}
                  </p>
                </div>
                <StatusBadge status={referenceQuote.status} label={statusLabel(dict, referenceQuote.status)} />
              </div>

              <dl className="grid gap-4 border-t border-oak/10 pt-5 text-sm md:grid-cols-4">
                <DetailItem label={t.date} value={formatDate(referenceQuote.created_at)} />
                <DetailItem
                  label={t.service}
                  value={referenceQuote.service_name ?? dict.common.notRecorded}
                />
                <DetailItem
                  label={t.address}
                  value={referenceQuote.address ?? dict.common.notRecorded}
                />
                <DetailItem
                  label={t.frequency}
                  value={referenceQuote.frequency ?? dict.common.notSelected}
                />
              </dl>
              <ButtonLink href={quoteHref(referenceQuote.id)} size="sm">
                {t.openReference}
              </ButtonLink>

              {pricedQuotes.length > 1 && (
                <div className="border-t border-oak/10 pt-5">
                  <p className="text-sm font-medium text-oak">
                    {t.recentPriced}
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {pricedQuotes.slice(0, 4).map((quote) => (
                      <ReferenceQuote key={quote.id} quote={quote} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title={t.noPricedTitle}
              body={t.noPricedBody}
            />
          )}
        </Card>
      </section>

      <section>
        <CardTitle>{t.staffNotes}</CardTitle>
        <Card className="mt-4">
          {profile ? (
            <form action={saveClientNotesForm} className="space-y-4">
              <input type="hidden" name="profile_id" value={profile.id} />
              <textarea
                name="internal_notes"
                defaultValue={profile.internal_notes ?? ""}
                rows={5}
                className="w-full rounded-2xl border border-oak/20 bg-white px-4 py-3 text-sm text-oak outline-none transition-colors focus:border-cinnamon"
                placeholder={t.staffNotesPlaceholder}
              />
              <button className="rounded-full bg-cinnamon px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-oak">
                {t.saveClientNotes}
              </button>
            </form>
          ) : (
            <p className="text-sm text-soil/60">
              {t.clientNotesFallback}
            </p>
          )}
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardTitle>{t.accountDetails}</CardTitle>
          <dl className="mt-5 space-y-4 text-sm">
            <DetailItem label={t.profileId} value={profile?.id ?? t.quoteOnlyRecord} />
            <DetailItem label={t.role} value={summary.role} />
            <DetailItem label={t.name} value={profile?.full_name ?? summary.name} />
            <DetailItem label={t.email} value={summary.email ?? dict.common.notProvided} />
            <DetailItem label={t.phone} value={summary.phone ?? dict.common.notProvided} />
            <DetailItem
              label={t.created}
              value={profile?.created_at ? formatDate(profile.created_at) : dict.common.notAvailable}
            />
            <DetailItem
              label={t.referralCode}
              value={profile?.referral_code ?? dict.common.notAvailable}
            />
          </dl>
        </Card>

        <Card>
          <CardTitle>{t.supportContext}</CardTitle>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <DetailItem label={t.lastRequest} value={formatDate(summary.latestQuoteAt)} />
            <DetailItem
              label={t.lastStatus}
              value={summary.latestStatus ?? t.noRequests}
            />
            <DetailItem
              label={t.lastService}
              value={summary.latestService ?? dict.common.notRecorded}
            />
            <DetailItem
              label={t.lastAddress}
              value={summary.latestAddress ?? dict.common.notRecorded}
            />
            <DetailItem label={t.payments} value={String(payments.length)} />
            <DetailItem label={t.contracts} value={String(contracts.length)} />
          </dl>
        </Card>
      </section>

      <section>
        <CardTitle>{t.pastQuotes}</CardTitle>
        <div className="mt-4 space-y-4">
          {!quotes.length ? (
            <EmptyState
              title={t.noHistoryTitle}
              body={t.noHistoryBody}
            />
          ) : (
            quotes.map((quote) => <QuoteHistoryCard key={quote.id} quote={quote} />)
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <RelatedList
          title={t.payments}
          empty={t.noPayments}
          items={payments}
          render={(payment) => <PaymentRowView key={payment.id} payment={payment} />}
        />
        <RelatedList
          title={t.contracts}
          empty={t.noContracts}
          items={contracts}
          render={(contract) => <ContractRowView key={contract.id} contract={contract} />}
        />
        <RelatedList
          title={t.rewards}
          empty={t.noRewards}
          items={rewards}
          render={(reward) => <RewardRowView key={reward.id} reward={reward} />}
        />
        <RelatedList
          title={t.referrals}
          empty={t.noReferrals}
          items={referrals}
          render={(referral) => <ReferralRowView key={referral.id} referral={referral} />}
        />
      </section>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-oak/10 bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-oak">{value}</p>
    </div>
  );
}

function QuoteHistoryCard({ quote }: { quote: QuoteRow }) {
  const dict = getDict();
  const t = dict.admin.clientDetail;
  const items = visibleLineItems(quote.line_items);
  const scope = quoteScopeDetails(quote);
  const conditionalServices = jsonStrings(quote.conditional_services);
  const total = Number(quote.total || 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl text-oak">
            {quote.address ?? dict.admin.inbox.quoteRequestFallback}
          </p>
          <p className="mt-1 text-sm text-soil/50">
            {formatDate(quote.created_at)} - {quote.service_name ?? dict.admin.inbox.serviceNotRecorded}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={quote.status} label={statusLabel(dict, quote.status)} />
          <span className="font-display text-2xl text-oak">
            {total > 0 ? formatCurrency(total) : dict.admin.clients.reviewNeeded}
          </span>
          <ButtonLink href={quoteHref(quote.id)} size="sm" variant="outline">
            {dict.admin.inbox.openQuote}
          </ButtonLink>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-oak/10 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label={t.requester} value={quote.requester_name ?? dict.common.notProvided} />
        <DetailItem label={t.contactEmail} value={quote.requester_email ?? dict.common.notProvided} />
        <DetailItem label={t.accountEmail} value={quote.account_email ?? dict.common.notAvailable} />
        <DetailItem label={t.phone} value={quote.requester_phone ?? dict.common.notProvided} />
        <DetailItem label={t.frequency} value={quote.frequency ?? dict.common.notSelected} />
        <DetailItem label={t.sourceZone} value={quote.source_zone ?? dict.common.notRecorded} />
        <DetailItem
          label={t.notification}
          value={quote.notification_status ?? dict.common.notRecorded}
        />
        <DetailItem label={t.quoteId} value={quote.id} />
      </dl>

      {conditionalServices.length > 0 && (
        <p className="mt-4 rounded-xl bg-sand/30 px-4 py-3 text-sm text-soil/70">
          {t.reviewItems}{conditionalServices.join(", ")}
        </p>
      )}

      {scope && (
        <div className="mt-4 rounded-xl bg-sand/30 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soil/45">
            {t.scopeDetails}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm text-soil/70">{scope}</p>
        </div>
      )}

      {items.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-oak/10 pt-4">
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="flex justify-between gap-4 text-sm text-soil/70"
            >
              <span>{item.label}</span>
              {Number(item.amount) > 0 && (
                <span className="tabular-nums">
                  {formatCurrency(Number(item.amount))}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ReferenceQuote({ quote }: { quote: QuoteRow }) {
  const dict = getDict();
  return (
    <div className="rounded-xl border border-oak/10 bg-sand/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-oak">
            {quote.service_name ?? dict.admin.inbox.serviceNotRecorded}
          </p>
          <p className="mt-1 truncate text-xs text-soil/50">
            {quote.address ?? dict.admin.jobs.addressNotRecorded}
          </p>
        </div>
        <span className="font-display text-xl text-oak">
          {formatCurrency(Number(quote.total))}
        </span>
      </div>
      <p className="mt-2 text-xs text-soil/50">{formatDate(quote.created_at)}</p>
    </div>
  );
}

function RelatedList<T>({
  title,
  empty,
  items,
  render,
}: {
  title: string;
  empty: string;
  items: T[];
  render: (item: T) => ReactNode;
}) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <div className="mt-4 space-y-3">
        {!items.length ? (
          <p className="text-sm text-soil/50">{empty}</p>
        ) : (
          items.map(render)
        )}
      </div>
    </Card>
  );
}

function PaymentRowView({ payment }: { payment: PaymentRow }) {
  const dict = getDict();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-oak/10 pt-3 first:border-t-0 first:pt-0">
      <div>
        <p className="text-sm font-medium capitalize text-oak">
          {payment.method} - {formatCurrency(Number(payment.amount))}
        </p>
        <p className="text-xs text-soil/50">{formatDate(payment.created_at)}</p>
      </div>
      <StatusBadge status={payment.status} label={statusLabel(dict, payment.status)} />
    </div>
  );
}

function ContractRowView({ contract }: { contract: ContractRow }) {
  const dict = getDict();
  const t = dict.admin.clientDetail;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-oak/10 pt-3 first:border-t-0 first:pt-0">
      <div>
        <p className="text-sm font-medium text-oak">
          {contract.quote_id ? `${dict.admin.clientDetail.quoteId} ${contract.quote_id.slice(0, 8)}` : dict.dashboard.contract.agreementTitle}
        </p>
        <p className="text-xs text-soil/50">
          {t.created2}{formatDate(contract.created_at)}
          {contract.signed_at ? ` - ${t.signed}${formatDate(contract.signed_at)}` : ""}
        </p>
      </div>
      <StatusBadge status={contract.status} label={statusLabel(dict, contract.status)} />
    </div>
  );
}

function RewardRowView({ reward }: { reward: RewardRow }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-oak/10 pt-3 first:border-t-0 first:pt-0">
      <div>
        <p className="text-sm font-medium text-oak">{reward.reason}</p>
        <p className="text-xs text-soil/50">{formatDate(reward.created_at)}</p>
      </div>
      <span className="font-display text-xl text-oak">
        {reward.delta > 0 ? "+" : ""}
        {reward.delta}
      </span>
    </div>
  );
}

function ReferralRowView({ referral }: { referral: ReferralRow }) {
  const dict = getDict();
  const t = dict.admin.clientDetail;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-oak/10 pt-3 first:border-t-0 first:pt-0">
      <div>
        <p className="text-sm font-medium text-oak">{referral.status}</p>
        <p className="text-xs text-soil/50">{formatDate(referral.created_at)}</p>
      </div>
      <span className="rounded-full bg-sand/40 px-3 py-1 text-xs text-soil/70">
        {referral.reward_granted ? t.rewardGranted : t.pendingReward}
      </span>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-soil/45">
        {label}
      </dt>
      <dd className="mt-1 break-words font-medium text-oak">{value ?? "N/A"}</dd>
    </div>
  );
}

function jsonStrings(value: Json) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function formatDate(value?: string | null) {
  if (!value) return getDict().common.notAvailable;
  return new Date(value).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
