import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { rewards } from "@/lib/config";
import { formatCurrency } from "@/lib/pricing";
import { Card, CardTitle, EmptyState, StatCard } from "@/components/dashboard-ui";

export const metadata = { title: "Rewards" };

export default async function RewardsPage() {
  const user = await getCurrentUser();
  const data = user ? await getDashboardData(user.id) : null;
  const ledger = data?.rewards ?? [];
  const balance = user?.profile?.points_balance ?? 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Points balance"
          value={balance.toLocaleString()}
          sub={`≈ ${formatCurrency(balance / rewards.pointsPerDollar)} toward your next clean`}
        />
        <StatCard
          label="Redemption rate"
          value={`${rewards.pointsPerDollar} pts`}
          sub="= $1 discount"
        />
      </div>

      <Card>
        <CardTitle>How you earn</CardTitle>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { l: "Create an account", v: rewards.signup },
            { l: "Accept a quote", v: rewards.quoteAccepted },
            { l: "Completed job", v: rewards.jobCompleted },
            { l: "Successful referral", v: rewards.referralSuccess },
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
        <CardTitle>Activity</CardTitle>
        <div className="mt-4">
          {ledger.length === 0 ? (
            <EmptyState
              title="No activity yet"
              body="Earn your first points by creating an account and booking a clean."
              ctaHref="/dashboard/quotes/new"
              ctaLabel="Start a quote"
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
