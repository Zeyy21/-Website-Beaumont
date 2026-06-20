import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { rewards, site } from "@/lib/config";
import { Card, CardTitle, StatCard } from "@/components/dashboard-ui";
import { ReferralLink } from "@/components/referral-link";

export const metadata = { title: "Referrals" };

export default async function ReferralsPage() {
  const user = await getCurrentUser();
  const data = user ? await getDashboardData(user.id) : null;

  const code = user?.profile?.referral_code ?? "BEAUMONT";
  const referrals = data?.referrals ?? [];
  const successful = referrals.filter((r) => r.reward_granted).length;

  return (
    <div className="space-y-8">
      <Card>
        <CardTitle>Your referral link</CardTitle>
        <p className="mt-2 text-sm text-soil/60">
          Share Beaumont with friends. When they book their first clean, you
          both earn {rewards.referralSuccess.toLocaleString()} points.
        </p>
        <div className="mt-5">
          <ReferralLink code={code} baseUrl={site.url} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Friends referred" value={String(referrals.length)} />
        <StatCard
          label="Rewards earned"
          value={(successful * rewards.referralSuccess).toLocaleString()}
          sub={`${successful} completed`}
        />
      </div>

      <Card>
        <CardTitle>How it works</CardTitle>
        <ol className="mt-4 space-y-4">
          {[
            "Share your unique link or code with a friend.",
            "They sign up and book their first Beaumont clean.",
            `Once their job is paid, you both receive ${rewards.referralSuccess.toLocaleString()} points.`,
          ].map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cinnamon text-sm font-semibold text-ivory">
                {i + 1}
              </span>
              <p className="pt-1 text-soil/70">{step}</p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
