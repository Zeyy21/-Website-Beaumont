import Link from "next/link";
import { Card, CardTitle, EmptyState, StatCard } from "@/components/dashboard-ui";
import { ButtonLink } from "@/components/ui";
import {
  clientHref,
  getAdminClientSummaries,
  type AdminClientSummary,
} from "@/lib/admin-clients";
import { formatCurrency } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: `${getDict().admin.clients.title}${getDict().common.brandSuffix}` };
}

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const t = getDict().admin.clients;
  const query = searchParams?.q?.trim() ?? "";
  const clients = await getAdminClientSummaries(query);
  const totalQuotes = clients.reduce((sum, client) => sum + client.quoteCount, 0);
  const quotedValue = clients.reduce(
    (sum, client) => sum + client.totalQuoted,
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <CardTitle>{t.title}</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-soil/60">
            {t.description}
          </p>
        </div>
        <ButtonLink href="/admin" variant="outline" size="sm">
          {t.openInbox}
        </ButtonLink>
      </div>

      <form action="/admin/clients" className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={query}
          placeholder={t.searchPlaceholder}
          className="min-h-11 flex-1 rounded-full border border-oak/15 bg-white px-5 text-sm text-oak outline-none transition-colors placeholder:text-soil/35 focus:border-cinnamon"
        />
        <button className="rounded-full bg-cinnamon px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-oak">
          {t.search}
        </button>
        {query && (
          <Link
            href="/admin/clients"
            className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm text-cinnamon hover:underline"
          >
            {t.clear}
          </Link>
        )}
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label={t.clientsShown} value={String(clients.length)} />
        <StatCard label={t.quotesShown} value={String(totalQuotes)} />
        <StatCard label={t.quotedValue} value={formatCurrency(quotedValue)} />
      </div>

      {!clients.length ? (
        <EmptyState
          title={query ? t.noMatchTitle : t.noClientsTitle}
          body={query ? t.noMatchBody : t.noClientsBody}
        />
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <ClientRow key={client.key} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}

function ClientRow({ client }: { client: AdminClientSummary }) {
  const t = getDict().admin.clients;
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={clientHref(client.key)}
              className="font-display text-2xl text-oak hover:text-cinnamon"
            >
              {client.name}
            </Link>
            <RoleBadge role={client.role} />
          </div>
          <p className="mt-1 text-sm text-soil/50">
            {client.email ?? t.noEmail}
            {client.phone ? ` - ${client.phone}` : ""}
          </p>
        </div>
        <ButtonLink href={clientHref(client.key)} size="sm" variant="outline">
          {t.viewAccount}
        </ButtonLink>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-oak/10 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-5">
        <ClientMetric label={t.quotes} value={String(client.quoteCount)} />
        <ClientMetric
          label={t.lastQuote}
          value={client.latestQuoteAt ? formatDate(client.latestQuoteAt) : t.none}
        />
        <ClientMetric
          label={t.lastTotal}
          value={
            client.latestTotal ? formatCurrency(client.latestTotal) : t.reviewNeeded
          }
        />
        <ClientMetric
          label={t.paid}
          value={client.paidTotal ? formatCurrency(client.paidTotal) : "$0"}
        />
        <ClientMetric
          label={t.points}
          value={
            typeof client.pointsBalance === "number"
              ? String(client.pointsBalance)
              : "N/A"
          }
        />
      </dl>

      {(client.latestAddress || client.latestService) && (
        <p className="mt-4 rounded-xl bg-sand/30 px-4 py-3 text-sm text-soil/65">
          {t.latestRequest} {client.latestService ?? t.serviceFallback}
          {client.latestAddress ? ` ${t.at}${client.latestAddress}` : ""}
        </p>
      )}
    </Card>
  );
}

function ClientMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-soil/45">
        {label}
      </dt>
      <dd className="mt-1 truncate font-medium text-oak">{value}</dd>
    </div>
  );
}

function RoleBadge({ role }: { role: AdminClientSummary["role"] }) {
  const t = getDict().admin.clients;
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold capitalize",
        role === "staff"
          ? "bg-oak text-ivory"
          : role === "quote-only"
            ? "bg-ochre/20 text-ochre"
            : "bg-green-100 text-green-800",
      )}
    >
      {role === "quote-only" ? t.quoteOnly : role}
    </span>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
