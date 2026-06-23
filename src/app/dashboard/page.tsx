import Link from "next/link";
import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/pricing";
import { rewards } from "@/lib/config";
import {
  Card,
  CardTitle,
  EmptyState,
  StatCard,
  StatusBadge,
} from "@/components/dashboard-ui";
import { CancelQuoteButton } from "@/components/quote/cancel-quote-button";

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  const data = user
    ? await getDashboardData(user.id)
    : {
        quotes: [],
        payments: [],
        contracts: [],
        rewards: [],
        referrals: [],
        gallery: [],
      };

  const points = user?.profile?.points_balance ?? 0;
  const activeQuotes = data.quotes.filter((q) =>
    ["requested", "sent", "accepted", "scheduled"].includes(q.status),
  ).length;
  const outstanding = data.payments
    .filter((p) => p.status === "awaiting")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Reward points"
          value={points.toLocaleString()}
          sub={`${formatCurrency(points / rewards.pointsPerDollar)} value`}
        />
        <StatCard label="Active quotes" value={String(activeQuotes)} />
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding)}
          sub={outstanding > 0 ? "Awaiting payment" : "All settled"}
        />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <CardTitle>Recent quotes</CardTitle>
          <Link href="/dashboard/quotes" className="text-sm text-cinnamon hover:underline">
            View all
          </Link>
        </div>

        {data.quotes.length === 0 ? (
          <EmptyState
            title="No quotes yet"
            body="Send the services you need reviewed and Beaumont will confirm a written quote."
            ctaHref="/dashboard/quotes/new"
            ctaLabel="Request a quote"
          />
        ) : (
          <ul className="divide-y divide-oak/10">
            {data.quotes.slice(0, 4).map((q) => {
              const hasTotal = Number(q.total) > 0;

              return (
                <li key={q.id} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-oak">{q.address ?? "Quote"}</p>
                    <p className="text-sm text-soil/50">
                      {new Date(q.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-display text-xl text-oak">
                        {hasTotal ? formatCurrency(Number(q.total)) : "Pending review"}
                      </span>
                      {(q.status === "requested" || q.status === "draft") && (
                        <CancelQuoteButton quoteId={q.id} />
                      )}
                    </div>
                    <StatusBadge status={q.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>Refer & earn</CardTitle>
          <p className="mt-2 text-sm text-soil/60">
            Share your code and you both earn{" "}
            {rewards.referralSuccess.toLocaleString()} points on their first job.
          </p>
          <Link
            href="/dashboard/referrals"
            className="mt-4 inline-block text-sm text-cinnamon hover:underline"
          >
            Get your referral link
          </Link>
        </Card>
        <Card>
          <CardTitle>Need another visit?</CardTitle>
          <p className="mt-2 text-sm text-soil/60">
            Send a new scope for review and redeem points once a quote is confirmed.
          </p>
          <Link
            href="/dashboard/quotes/new"
            className="mt-4 inline-block text-sm text-cinnamon hover:underline"
          >
            New quote request
          </Link>
        </Card>
      </div>
    </div>
  );
}
