import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { rewards, site } from "@/lib/config";
import { Card, CardTitle, StatCard } from "@/components/dashboard-ui";
import { ReferralLink } from "@/components/referral-link";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: getDict().dashboard.nav.referrals };
}

export default async function ReferralsPage() {
  const t = getDict().dashboard.referrals;
  const user = await getCurrentUser();
  const data = user ? await getDashboardData(user.id) : null;

  const code = user?.profile?.referral_code ?? "BEAUMONT";
  const referrals = data?.referrals ?? [];
  const successful = referrals.filter((r) => r.reward_granted).length;
  const pts = rewards.referralSuccess.toLocaleString();

  return (
    <div className="space-y-8">
      <Card>
        <CardTitle>{t.yourLink}</CardTitle>
        <p className="mt-2 text-sm text-soil/60">
          {t.shareBody} {pts} {t.points}
        </p>
        <div className="mt-5">
          <ReferralLink code={code} baseUrl={site.url} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label={t.friendsReferred} value={String(referrals.length)} />
        <StatCard
          label={t.rewardsEarned}
          value={(successful * rewards.referralSuccess).toLocaleString()}
          sub={`${successful} ${t.completed}`}
        />
      </div>

      <Card>
        <CardTitle>{t.howItWorks}</CardTitle>
        <ol className="mt-4 space-y-4">
          {[
            t.step1,
            t.step2,
            `${t.step3a} ${pts} ${t.step3b}`,
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
