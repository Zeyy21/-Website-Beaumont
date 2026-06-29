import Link from "next/link";
import { AdminActionButton } from "@/components/admin-action-button";
import { Card, CardTitle, EmptyState, StatCard, StatusBadge } from "@/components/dashboard-ui";
import { ButtonLink } from "@/components/ui";
import { getAdminInboxData, type AdminQuoteCard } from "@/lib/admin-quotes";
import { formatCurrency } from "@/lib/pricing";
import { quoteScopeDetails } from "@/lib/quote-scope";
import {
  markQuoteAccepted,
  markQuoteCompleted,
  sendQuoteToCustomer,
  applyPreviousQuoteForm,
} from "./actions";
import { getDict } from "@/lib/i18n/server";
import { statusLabel } from "@/lib/i18n/dictionaries";

export function generateMetadata() {
  return { title: `${getDict().admin.inbox.title}${getDict().common.brandSuffix}` };
}

export default async function AdminHome() {
  const t = getDict().admin.inbox;
  const { cards, counts, awaitingPayments } = await getAdminInboxData();
  const needsQuote = cards.filter((card) => card.quote.status === "requested");
  const sent = cards.filter((card) => card.quote.status === "sent");
  const accepted = cards.filter((card) => card.quote.status === "accepted");
  const scheduled = cards.filter((card) => card.quote.status === "scheduled");

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <CardTitle>{t.title}</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-soil/60">
            {t.description}
          </p>
        </div>
        <ButtonLink href="/admin/clients" variant="outline" size="sm">
          {t.findClient}
        </ButtonLink>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        <StatCard label={t.needsQuote} value={String(counts.needsQuote)} />
        <StatCard label={t.sent} value={String(counts.sent)} />
        <StatCard label={t.accepted} value={String(counts.accepted)} />
        <StatCard label={t.scheduled} value={String(counts.scheduled)} />
        <StatCard label={t.awaitingPay} value={String(awaitingPayments.length)} />
      </section>

      {!cards.length ? (
        <EmptyState
          title={t.noWorkTitle}
          body={t.noWorkBody}
        />
      ) : (
        <div className="space-y-8">
          <InboxSection
            title={t.needsQuote}
            body={t.needsQuoteBody}
            cards={needsQuote}
          />
          <InboxSection
            title={t.sentWaiting}
            body={t.sentWaitingBody}
            cards={sent}
          />
          <InboxSection
            title={t.acceptedNeedsScheduling}
            body={t.acceptedBody}
            cards={accepted}
          />
          <InboxSection
            title={t.scheduled}
            body={t.scheduledBody}
            cards={scheduled}
          />
        </div>
      )}
    </div>
  );
}

function InboxSection({
  title,
  body,
  cards,
}: {
  title: string;
  body: string;
  cards: AdminQuoteCard[];
}) {
  if (!cards.length) return null;

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-1 text-sm text-soil/55">{body}</p>
        </div>
        <span className="rounded-full bg-sand/40 px-3 py-1 text-xs font-semibold text-soil/60">
          {cards.length}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {cards.map((card) => (
          <InboxCard key={card.quote.id} card={card} />
        ))}
      </div>
    </section>
  );
}

function InboxCard({ card }: { card: AdminQuoteCard }) {
  const dict = getDict();
  const t = dict.admin.inbox;
  const { quote, previousQuote } = card;
  const scope = quoteScopeDetails(quote);
  const hasTotal = Number(quote.total) > 0;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={card.quoteUrl}
              className="font-display text-2xl text-oak hover:text-cinnamon"
            >
              {quote.requester_name ?? t.quoteRequestFallback}
            </Link>
            <StatusBadge status={quote.status} label={statusLabel(dict, quote.status)} />
          </div>
          <p className="mt-1 text-sm text-soil/50">
            {quote.address ?? t.addressUnavailable} -{" "}
            {quote.service_name ?? t.serviceNotRecorded}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl text-oak">
            {hasTotal ? formatCurrency(Number(quote.total)) : t.needsPrice}
          </p>
          <p className="text-xs text-soil/45">{card.nextAction}</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-oak/10 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <AdminDetail
          label={t.email}
          value={quote.requester_email ?? quote.account_email ?? dict.common.notProvided}
          href={
            quote.requester_email || quote.account_email
              ? `mailto:${quote.requester_email ?? quote.account_email}`
              : undefined
          }
        />
        <AdminDetail
          label={t.phone}
          value={quote.requester_phone ?? dict.common.notProvided}
          href={quote.requester_phone ? `tel:${quote.requester_phone}` : undefined}
        />
        <AdminDetail
          label={t.requested}
          value={new Date(quote.created_at).toLocaleDateString("en-CA")}
        />
        <AdminDetail
          label={dict.admin.inbox.scheduled}
          value={
            quote.scheduled_for
              ? new Date(quote.scheduled_for).toLocaleDateString("en-CA")
              : dict.common.notSet
          }
        />
      </dl>

      {previousQuote && (
        <div className="mt-4 rounded-xl border border-ochre/20 bg-sand/30 px-4 py-3 text-sm text-soil/70">
          {t.previousMatch}{" "}
          <strong className="text-oak">
            {formatCurrency(Number(previousQuote.total))}
          </strong>{" "}
          {dict.admin.clients.at}{new Date(previousQuote.created_at).toLocaleDateString("en-CA")}
          {!hasTotal && (
            <form action={applyPreviousQuoteForm} className="mt-3">
              <input type="hidden" name="quote_id" value={quote.id} />
              <input type="hidden" name="source_quote_id" value={previousQuote.id} />
              <button className="rounded-full bg-cinnamon px-4 py-2 text-xs font-semibold text-ivory transition-colors hover:bg-oak">
                {t.usePrevious}
              </button>
            </form>
          )}
        </div>
      )}

      {scope && (
        <p className="mt-4 line-clamp-3 whitespace-pre-line rounded-xl bg-sand/20 px-4 py-3 text-sm text-soil/65">
          {scope}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-oak/10 pt-5">
        <ButtonLink href={card.quoteUrl} size="sm">
          {t.openQuote}
        </ButtonLink>
        {card.clientUrl && (
          <ButtonLink href={card.clientUrl} size="sm" variant="outline">
            {t.viewClient}
          </ButtonLink>
        )}
        {quote.status === "requested" && hasTotal && (
          <AdminActionButton
            id={quote.id}
            action={sendQuoteToCustomer}
            label={t.sendQuote}
            doneLabel={t.sent}
            variant="outline"
          />
        )}
        {quote.status === "sent" && (
          <AdminActionButton
            id={quote.id}
            action={markQuoteAccepted}
            label={t.markAccepted}
            doneLabel={t.accepted}
            variant="outline"
          />
        )}
        {quote.status === "scheduled" && (
          <AdminActionButton
            id={quote.id}
            action={markQuoteCompleted}
            label={t.markCompleted}
            doneLabel={t.completed}
            variant="outline"
          />
        )}
      </div>
    </Card>
  );
}

function AdminDetail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
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
          value
        )}
      </dd>
    </div>
  );
}
