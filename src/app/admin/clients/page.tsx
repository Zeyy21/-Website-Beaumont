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

export const metadata = { title: "Admin - Clients" };

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
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
          <CardTitle>Clients</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-soil/60">
            Search customer accounts, open support context, and confirm previous
            quote totals before replying.
          </p>
        </div>
        <ButtonLink href="/admin" variant="outline" size="sm">
          Open requests
        </ButtonLink>
      </div>

      <form action="/admin/clients" className="flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search name, email, phone, address, service, or status"
          className="min-h-11 flex-1 rounded-full border border-oak/15 bg-white px-5 text-sm text-oak outline-none transition-colors placeholder:text-soil/35 focus:border-cinnamon"
        />
        <button className="rounded-full bg-cinnamon px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-oak">
          Search
        </button>
        {query && (
          <Link
            href="/admin/clients"
            className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm text-cinnamon hover:underline"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Clients shown" value={String(clients.length)} />
        <StatCard label="Quotes shown" value={String(totalQuotes)} />
        <StatCard label="Quoted value" value={formatCurrency(quotedValue)} />
      </div>

      {!clients.length ? (
        <EmptyState
          title={query ? "No matching clients" : "No clients yet"}
          body={
            query
              ? "Try a different name, email, phone, address, or service."
              : "Customer accounts and quote requests will appear here."
          }
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
            {client.email ?? "No email on file"}
            {client.phone ? ` - ${client.phone}` : ""}
          </p>
        </div>
        <ButtonLink href={clientHref(client.key)} size="sm" variant="outline">
          View account
        </ButtonLink>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-oak/10 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-5">
        <ClientMetric label="Quotes" value={String(client.quoteCount)} />
        <ClientMetric
          label="Last quote"
          value={client.latestQuoteAt ? formatDate(client.latestQuoteAt) : "None"}
        />
        <ClientMetric
          label="Last total"
          value={
            client.latestTotal ? formatCurrency(client.latestTotal) : "Review needed"
          }
        />
        <ClientMetric
          label="Paid"
          value={client.paidTotal ? formatCurrency(client.paidTotal) : "$0"}
        />
        <ClientMetric
          label="Points"
          value={
            typeof client.pointsBalance === "number"
              ? String(client.pointsBalance)
              : "N/A"
          }
        />
      </dl>

      {(client.latestAddress || client.latestService) && (
        <p className="mt-4 rounded-xl bg-sand/30 px-4 py-3 text-sm text-soil/65">
          Latest request: {client.latestService ?? "Service not recorded"}
          {client.latestAddress ? ` at ${client.latestAddress}` : ""}
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
      {role === "quote-only" ? "Quote only" : role}
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
