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

export const metadata = { title: "Admin - Quote" };

export default async function AdminQuotePage({
  params,
}: {
  params: { quoteId: string };
}) {
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
            Back to inbox
          </Link>
          <h1 className="mt-2 font-display text-4xl text-oak">
            {quote.requester_name ?? profile?.full_name ?? "Quote request"}
          </h1>
          <p className="mt-1 text-sm text-soil/55">
            {quote.address ?? "Address not recorded"} -{" "}
            {quote.service_name ?? "Service not recorded"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {clientUrl && (
            <ButtonLink href={clientUrl} variant="outline" size="sm">
              View client
            </ButtonLink>
          )}
          <StatusBadge status={quote.status} />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryTile
          label="Final quote"
          value={
            Number(quote.total) > 0
              ? formatCurrency(Number(quote.total))
              : "Not set"
          }
        />
        <SummaryTile label="Status" value={statusLabel(quote.status)} />
        <SummaryTile label="Requested" value={formatDate(quote.created_at)} />
        <SummaryTile
          label="Scheduled"
          value={quote.scheduled_for ? formatDateTime(quote.scheduled_for) : "Not set"}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardTitle>Review and send</CardTitle>
          <p className="mt-1 text-sm text-soil/60">
            Set the final quote, keep staff-only context, and move the request
            through the real workflow.
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
          <CardTitle>Customer</CardTitle>
          <dl className="mt-5 space-y-4 text-sm">
            <DetailItem
              label="Name"
              value={quote.requester_name ?? profile?.full_name ?? "Not provided"}
            />
            <DetailItem
              label="Email"
              value={quote.requester_email ?? quote.account_email ?? profile?.email ?? "Not provided"}
              href={
                quote.requester_email || quote.account_email || profile?.email
                  ? `mailto:${quote.requester_email ?? quote.account_email ?? profile?.email}`
                  : undefined
              }
            />
            <DetailItem
              label="Phone"
              value={quote.requester_phone ?? profile?.phone ?? "Not provided"}
              href={
                quote.requester_phone ?? profile?.phone
                  ? `tel:${quote.requester_phone ?? profile?.phone}`
                  : undefined
              }
            />
            <DetailItem label="Account email" value={quote.account_email ?? "Not available"} />
          </dl>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-oak/10 pt-5">
            {quote.status === "sent" && (
              <AdminActionButton
                id={quote.id}
                action={markQuoteAccepted}
                label="Mark accepted"
                doneLabel="Accepted"
                variant="outline"
              />
            )}
            {quote.status === "accepted" && (
              <AdminActionButton
                id={quote.id}
                action={markQuoteScheduled}
                label="Mark scheduled"
                doneLabel="Scheduled"
                variant="outline"
              />
            )}
            {quote.status === "scheduled" && (
              <AdminActionButton
                id={quote.id}
                action={markQuoteCompleted}
                label="Mark completed"
                doneLabel="Completed"
                variant="outline"
              />
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>Previous quote match</CardTitle>
          {previousQuote ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-ochre/30 bg-sand/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ochre">
                  Use this to keep pricing consistent
                </p>
                <p className="mt-2 font-display text-4xl text-oak">
                  {formatCurrency(Number(previousQuote.total))}
                </p>
                <p className="mt-1 text-sm text-soil/60">
                  {formatDate(previousQuote.created_at)} -{" "}
                  {previousQuote.address ?? "Address not recorded"}
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
                  Use previous quote
                </button>
              </form>
            </div>
          ) : (
            <p className="mt-4 text-sm text-soil/60">
              No matching priced quote found for the same client, address, and
              service.
            </p>
          )}
        </Card>

        <Card>
          <CardTitle>Request scope</CardTitle>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <DetailItem label="Service" value={quote.service_name ?? "Not recorded"} />
            <DetailItem label="Visit rhythm" value={quote.frequency ?? "Not selected"} />
            <DetailItem label="Source zone" value={quote.source_zone ?? "Not recorded"} />
            <DetailItem label="Notification" value={quote.notification_status} />
          </dl>
          {conditionalServices.length > 0 && (
            <p className="mt-4 rounded-xl bg-sand/30 px-4 py-3 text-sm text-soil/70">
              Review items: {conditionalServices.join(", ")}
            </p>
          )}
          {scope && (
            <div className="mt-4 rounded-xl bg-sand/30 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soil/45">
                Customer scope
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-soil/70">{scope}</p>
            </div>
          )}
          <LineItems quote={quote} />
        </Card>
      </section>

      <section>
        <CardTitle>Priced history</CardTitle>
        <div className="mt-4 space-y-3">
          {!pricedHistory.length ? (
            <EmptyState
              title="No previous priced quotes"
              body="Once this customer has a confirmed quote, it will appear here for future consistency."
            />
          ) : (
            pricedHistory.map((item) => (
              <HistoryRow key={item.id} quote={item} currentQuoteId={quote.id} />
            ))
          )}
        </div>
      </section>

      <section>
        <CardTitle>Payments on this quote</CardTitle>
        <div className="mt-4 space-y-3">
          {!payments.length ? (
            <p className="text-sm text-soil/50">No payments linked yet.</p>
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
            {formatDate(quote.created_at)} - {quote.service_name ?? "Service"} -{" "}
            {quote.address ?? "Address not recorded"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={quote.status} />
          <form action={applyPreviousQuoteForm}>
            <input type="hidden" name="quote_id" value={currentQuoteId} />
            <input type="hidden" name="source_quote_id" value={quote.id} />
            <button className="rounded-full border border-oak/30 px-4 py-2 text-sm font-medium text-oak transition-colors hover:bg-oak hover:text-ivory">
              Use this price
            </button>
          </form>
        </div>
      </div>
    </Card>
  );
}

function PaymentRowView({ payment }: { payment: PaymentRow }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium capitalize text-oak">
            {payment.method} - {formatCurrency(Number(payment.amount))}
          </p>
          <p className="text-xs text-soil/50">{formatDate(payment.created_at)}</p>
        </div>
        <StatusBadge status={payment.status} />
      </div>
    </Card>
  );
}

function jsonStrings(value: Json) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    requested: "Needs quote",
    sent: "Sent",
    accepted: "Accepted",
    scheduled: "Scheduled",
    completed: "Completed",
  };
  return labels[value] ?? value;
}

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
