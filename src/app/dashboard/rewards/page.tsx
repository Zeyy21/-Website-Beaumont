import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { rewards } from "@/lib/config";
import { formatCurrency } from "@/lib/pricing";
import { Card, CardTitle, EmptyState, StatCard } from "@/components/dashboard-ui";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: getDict().dashboard.nav.rewards };
}

export default async function RewardsPage() {
  const t = getDict().dashboard.rewards;
  const user = await getCurrentUser();
  const data = user ? await getDashboardData(user.id) : null;
  const ledger = data?.rewards ?? [];
  const balance = user?.profile?.points_balance ?? 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label={t.pointsBalance}
          value={balance.toLocaleString()}
          sub={`${formatCurrency(balance / rewards.pointsPerDollar)} ${t.towardVisit}`}
        />
        <StatCard
          label={t.redemptionRate}
          value={t.pts}
          sub={t.discount}
        />
      </div>

      <Card>
        <CardTitle>{t.howYouEarn}</CardTitle>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { l: t.createAccount, v: rewards.signup },
            { l: t.acceptQuote, v: rewards.quoteAccepted },
            { l: t.completedJob, v: rewards.jobCompleted },
            { l: t.successfulReferral, v: rewards.referralSuccess },
          ].map((r) => (
            <li
              key={r.l}
              className="flex items-center justify-between rounded-xl bg-sand/20 px-4 py-3"
            >
              <span className="text-soil/70">{r.l}</span>
              <span className="font-display text-lg text-cinnamon">
                +{r.v.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>{t.activity}</CardTitle>
        <div className="mt-4">
          {ledger.length === 0 ? (
            <EmptyState
              title={t.noActivityTitle}
              body={t.noActivityBody}
              ctaHref="/dashboard/quotes/new"
              ctaLabel={t.requestQuote}
            />
          ) : (
            <ul className="divide-y divide-oak/10">
              {ledger.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-oak">{r.reason}</p>
                    <p className="text-sm text-soil/50">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`font-display text-lg ${r.delta >= 0 ? "text-green-700" : "text-soil/60"}`}
                  >
                    {r.delta >= 0 ? "+" : ""}
                    {r.delta.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
