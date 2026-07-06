import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardTitle, EmptyState, StatusBadge } from "@/components/dashboard-ui";
import { AdminActionButton } from "@/components/admin-action-button";
import { AdminQuoteReviewForm } from "@/components/admin-quote-review-form";
import { ButtonLink } from "@/components/ui";
import { getAdminQuoteDetails, quoteHref } from "@/lib/admin-quotes";
import { formatCurrency } from "@/lib/pricing";
import { quoteScopeDetails, visibleLineItems } from "@/lib/quote-scope";
import {
  markQuoteAccepted,
  markQuoteCompleted,
  markQuoteScheduled,
  applyPreviousQuoteForm,
} from "@/app/admin/actions";
import type { Json, PaymentRow, QuoteRow } from "@/lib/supabase/types";
import { getDict } from "@/lib/i18n/server";
import { statusLabel } from "@/lib/i18n/dictionaries";

export function generateMetadata() {
  return { title: `${getDict().admin.quoteDetail.requestScope}${getDict().common.brandSuffix}` };
}

export default async function AdminQuotePage({
  params,
}: {
  params: { quoteId: string };
}) {
  const dict = getDict();
  const t = dict.admin.quoteDetail;
  const details = await getAdminQuoteDetails(params.quoteId);
  if (!details) notFound();

  const { quote, profile, clientUrl, history, previousQuote, payments } = details;
  const scope = quoteScopeDetails(quote);
  const conditionalServices = jsonStrings(quote.conditional_services);
  const pricedHistory = history.filter(
    (item) => item.id !== quote.id && Number(item.total) > 0,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-cinnamon hover:underline">
            {t.backToInbox}
          </Link>
          <h1 className="mt-2 font-display text-4xl text-oak">
            {quote.requester_name ?? profile?.full_name ?? dict.admin.inbox.quoteRequestFallback}
          </h1>
          <p className="mt-1 text-sm text-soil/55">
            {quote.address ?? dict.admin.jobs.addressNotRecorded} -{" "}
            {quote.service_name ?? dict.admin.inbox.serviceNotRecorded}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {clientUrl && (
            <ButtonLink href={clientUrl} variant="outline" size="sm">
              {t.viewClient}
            </ButtonLink>
          )}
          <StatusBadge status={quote.status} label={statusLabel(dict, quote.status)} />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryTile
          label={t.finalQuote}
          value={
            Number(quote.total) > 0
              ? formatCurrency(Number(quote.total))
              : dict.common.notSet
          }
        />
        <SummaryTile label={t.status} value={statusLabel(dict, quote.status)} />
        <SummaryTile label={t.requested} value={formatDate(quote.created_at)} />
        <SummaryTile
          label={t.scheduled}
          value={quote.scheduled_for ? formatDateTime(quote.scheduled_for) : dict.common.notSet}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardTitle>{t.reviewAndSend}</CardTitle>
          <p className="mt-1 text-sm text-soil/60">
            {t.reviewDescription}
          </p>
          <div className="mt-5">
            <AdminQuoteReviewForm
              quoteId={quote.id}
              total={Number(quote.total || 0)}
              status={quote.status}
              scheduledFor={quote.scheduled_for}
              internalNotes={quote.internal_notes}
            />
          </div>
        </Card>

        <Card>
          <CardTitle>{t.customer}</CardTitle>
          <dl className="mt-5 space-y-4 text-sm">
            <DetailItem
              label={t.name}
              value={quote.requester_name ?? profile?.full_name ?? dict.common.notProvided}
            />
            <DetailItem
              label={t.email}
              value={quote.requester_email ?? quote.account_email ?? profile?.email ?? dict.common.notProvided}
              href={
                quote.requester_email || quote.account_email || profile?.email
                  ? `mailto:${quote.requester_email ?? quote.account_email ?? profile?.email}`
                  : undefined
              }
            />
            <DetailItem
              label={t.phone}
              value={quote.requester_phone ?? profile?.phone ?? dict.common.notProvided}
              href={
                quote.requester_phone ?? profile?.phone
                  ? `tel:${quote.requester_phone ?? profile?.phone}`
                  : undefined
              }
            />
            <DetailItem label={t.accountEmail} value={quote.account_email ?? dict.common.notAvailable} />
          </dl>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-oak/10 pt-5">
            {quote.status === "sent" && (
              <AdminActionButton
                id={quote.id}
                action={markQuoteAccepted}
                label={t.markAccepted}
                doneLabel={dict.admin.inbox.accepted}
                variant="outline"
              />
            )}
            {quote.status === "accepted" && (
              <AdminActionButton
                id={quote.id}
                action={markQuoteScheduled}
                label={t.markScheduled}
                doneLabel={dict.admin.inbox.scheduled}
                variant="outline"
              />
            )}
            {quote.status === "scheduled" && (
              <AdminActionButton
                id={quote.id}
                action={markQuoteCompleted}
                label={t.markCompleted}
                doneLabel={dict.admin.inbox.completed}
                variant="outline"
              />
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>{t.previousMatch}</CardTitle>
          {previousQuote ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-ochre/30 bg-sand/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
                  {t.keepConsistent}
                </p>
                <p className="mt-2 font-display text-4xl text-oak">
                  {formatCurrency(Number(previousQuote.total))}
                </p>
                <p className="mt-1 text-sm text-soil/60">
                  {formatDate(previousQuote.created_at)} -{" "}
                  {previousQuote.address ?? dict.admin.jobs.addressNotRecorded}
                </p>
              </div>
              <form action={applyPreviousQuoteForm}>
                <input type="hidden" name="quote_id" value={quote.id} />
                <input
                  type="hidden"
                  name="source_quote_id"
                  value={previousQuote.id}
                />
                <button className="rounded-full bg-cinnamon px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-oak">
                  {t.usePrevious}
                </button>
              </form>
            </div>
          ) : (
            <p className="mt-4 text-sm text-soil/60">
              {t.noMatch}
            </p>
          )}
        </Card>

        <Card>
          <CardTitle>{t.requestScope}</CardTitle>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <DetailItem label={t.service} value={quote.service_name ?? dict.common.notRecorded} />
            <DetailItem label={t.visitRhythm} value={quote.frequency ?? dict.common.notSelected} />
            <DetailItem label={t.sourceZone} value={quote.source_zone ?? dict.common.notRecorded} />
            <DetailItem label={t.notification} value={quote.notification_status} />
          </dl>
          {conditionalServices.length > 0 && (
            <p className="mt-4 rounded-xl bg-sand/30 px-4 py-3 text-sm text-soil/70">
              {t.reviewItems}{conditionalServices.join(", ")}
            </p>
          )}
          {scope && (
            <div className="mt-4 rounded-xl bg-sand/30 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soil/45">
                {t.customerScope}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-soil/70">{scope}</p>
            </div>
          )}
          <LineItems quote={quote} />
        </Card>
      </section>

      <section>
        <CardTitle>{t.pricedHistory}</CardTitle>
        <div className="mt-4 space-y-3">
          {!pricedHistory.length ? (
            <EmptyState
              title={t.noPricedTitle}
              body={t.noPricedBody}
            />
          ) : (
            pricedHistory.map((item) => (
              <HistoryRow key={item.id} quote={item} currentQuoteId={quote.id} />
            ))
          )}
        </div>
      </section>

      <section>
        <CardTitle>{t.paymentsOnQuote}</CardTitle>
        <div className="mt-4 space-y-3">
          {!payments.length ? (
            <p className="text-sm text-soil/50">{t.noPaymentsLinked}</p>
          ) : (
            payments.map((payment) => <PaymentRowView key={payment.id} payment={payment} />)
          )}
        </div>
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

function DetailItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null;
  href?: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-soil/45">
        {label}
      </dt>
      <dd className="mt-1 break-words font-medium text-oak">
        {href ? (
          <a className="text-cinnamon hover:underline" href={href}>
            {value}
          </a>
        ) : (
          value ?? "N/A"
        )}
      </dd>
    </div>
  );
}

function LineItems({ quote }: { quote: QuoteRow }) {
  const items = visibleLineItems(quote.line_items);
  if (!items.length) return null;

  return (
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
  );
}

function HistoryRow({
  quote,
  currentQuoteId,
}: {
  quote: QuoteRow;
  currentQuoteId: string;
}) {
  const dict = getDict();
  const t = dict.admin.quoteDetail;
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={quoteHref(quote.id)}
            className="font-display text-2xl text-oak hover:text-cinnamon"
          >
            {formatCurrency(Number(quote.total))}
          </Link>
          <p className="mt-1 text-sm text-soil/50">
            {formatDate(quote.created_at)} - {quote.service_name ?? dict.dashboard.payments.serviceFallback} -{" "}
            {quote.address ?? dict.admin.jobs.addressNotRecorded}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={quote.status} label={statusLabel(dict, quote.status)} />
          <form action={applyPreviousQuoteForm}>
            <input type="hidden" name="quote_id" value={currentQuoteId} />
            <input type="hidden" name="source_quote_id" value={quote.id} />
            <button className="rounded-full border border-oak/30 px-4 py-2 text-sm font-medium text-oak transition-colors hover:bg-oak hover:text-ivory">
              {t.useThisPrice}
            </button>
          </form>
        </div>
      </div>
    </Card>
  );
}

function PaymentRowView({ payment }: { payment: PaymentRow }) {
  const dict = getDict();
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium capitalize text-oak">
            {payment.method} - {formatCurrency(Number(payment.amount))}
          </p>
          <p className="text-xs text-soil/50">{formatDate(payment.created_at)}</p>
        </div>
        <StatusBadge status={payment.status} label={statusLabel(dict, payment.status)} />
      </div>
    </Card>
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

function formatDateTime(value?: string | null) {
  if (!value) return getDict().common.notAvailable;
  return new Date(value).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
