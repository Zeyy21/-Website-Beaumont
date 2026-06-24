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

export const metadata = { title: "Admin - Inbox" };

export default async function AdminHome() {
  const { cards, counts, awaitingPayments } = await getAdminInboxData();
  const needsQuote = cards.filter((card) => card.quote.status === "requested");
  const sent = cards.filter((card) => card.quote.status === "sent");
  const accepted = cards.filter((card) => card.quote.status === "accepted");
  const scheduled = cards.filter((card) => card.quote.status === "scheduled");

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <CardTitle>Inbox</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-soil/60">
            Work quote requests from first review to accepted job. Open a quote
            to edit price, reuse past pricing, add staff notes, and schedule.
          </p>
        </div>
        <ButtonLink href="/admin/clients" variant="outline" size="sm">
          Find client
        </ButtonLink>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        <StatCard label="Needs quote" value={String(counts.needsQuote)} />
        <StatCard label="Sent" value={String(counts.sent)} />
        <StatCard label="Accepted" value={String(counts.accepted)} />
        <StatCard label="Scheduled" value={String(counts.scheduled)} />
        <StatCard label="Awaiting pay" value={String(awaitingPayments.length)} />
      </section>

      {!cards.length ? (
        <EmptyState
          title="No active work"
          body="New customer quote requests and active jobs will appear here."
        />
      ) : (
        <div className="space-y-8">
          <InboxSection
            title="Needs quote"
            body="Set a final price or reuse a matching previous quote, then send it."
            cards={needsQuote}
          />
          <InboxSection
            title="Sent, waiting for customer"
            body="Follow up, resend if needed, or mark accepted once the customer agrees."
            cards={sent}
          />
          <InboxSection
            title="Accepted, needs scheduling"
            body="Schedule the job from the quote detail page."
            cards={accepted}
          />
          <InboxSection
            title="Scheduled"
            body="Complete the job when service is done."
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
              {quote.requester_name ?? "Quote request"}
            </Link>
            <StatusBadge status={quote.status} />
          </div>
          <p className="mt-1 text-sm text-soil/50">
            {quote.address ?? "Address unavailable"} -{" "}
            {quote.service_name ?? "Service not recorded"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl text-oak">
            {hasTotal ? formatCurrency(Number(quote.total)) : "Needs price"}
          </p>
          <p className="text-xs text-soil/45">{card.nextAction}</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-oak/10 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <AdminDetail
          label="Email"
          value={quote.requester_email ?? quote.account_email ?? "Not provided"}
          href={
            quote.requester_email || quote.account_email
              ? `mailto:${quote.requester_email ?? quote.account_email}`
              : undefined
          }
        />
        <AdminDetail
          label="Phone"
          value={quote.requester_phone ?? "Not provided"}
          href={quote.requester_phone ? `tel:${quote.requester_phone}` : undefined}
        />
        <AdminDetail
          label="Requested"
          value={new Date(quote.created_at).toLocaleDateString("en-CA")}
        />
        <AdminDetail
          label="Scheduled"
          value={
            quote.scheduled_for
              ? new Date(quote.scheduled_for).toLocaleDateString("en-CA")
              : "Not set"
          }
        />
      </dl>

      {previousQuote && (
        <div className="mt-4 rounded-xl border border-ochre/20 bg-sand/30 px-4 py-3 text-sm text-soil/70">
          Previous match:{" "}
          <strong className="text-oak">
            {formatCurrency(Number(previousQuote.total))}
          </strong>{" "}
          on {new Date(previousQuote.created_at).toLocaleDateString("en-CA")}
          {!hasTotal && (
            <form action={applyPreviousQuoteForm} className="mt-3">
              <input type="hidden" name="quote_id" value={quote.id} />
              <input type="hidden" name="source_quote_id" value={previousQuote.id} />
              <button className="rounded-full bg-cinnamon px-4 py-2 text-xs font-semibold text-ivory transition-colors hover:bg-oak">
                Use previous quote
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
          Open quote
        </ButtonLink>
        {card.clientUrl && (
          <ButtonLink href={card.clientUrl} size="sm" variant="outline">
            View client
          </ButtonLink>
        )}
        {quote.status === "requested" && hasTotal && (
          <AdminActionButton
            id={quote.id}
            action={sendQuoteToCustomer}
            label="Send quote"
            doneLabel="Sent"
            variant="outline"
          />
        )}
        {quote.status === "sent" && (
          <AdminActionButton
            id={quote.id}
            action={markQuoteAccepted}
            label="Mark accepted"
            doneLabel="Accepted"
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
