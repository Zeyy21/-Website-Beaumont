import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/env";
import { Monogram } from "@/components/ui";
import { DashboardNav } from "@/components/dashboard-nav";
import { rewards } from "@/lib/config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Gate: if Supabase is configured but no session, send to login.
  const user = await getCurrentUser();
  if (supabaseConfigured && !user) redirect("/login?next=/dashboard");

  const points = user?.profile?.points_balance ?? 0;
  const name =
    user?.profile?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[280px_1fr]">
      {/* sidebar */}
      <aside className="texture-soil flex flex-col gap-6 p-5 text-ivory lg:sticky lg:top-0 lg:h-screen">
        <Link href="/" className="flex items-center gap-3 px-2">
          <Monogram size={32} />
          <span className="font-display text-lg tracking-[0.18em]">BEAUMONT</span>
        </Link>

        {supabaseConfigured && (
          <div className="rounded-2xl bg-ivory/5 p-4">
            <p className="text-sm text-ivory/60">Reward points</p>
            <p className="font-display text-3xl text-sand">
              {points.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-ivory/40">
              ≈ ${(points / rewards.pointsPerDollar).toFixed(0)} toward your next clean
            </p>
          </div>
        )}

        <DashboardNav />
      </aside>

      {/* content */}
      <main className="p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          {!supabaseConfigured && (
            <div className="mb-8 rounded-2xl border border-ochre/30 bg-sand/40 p-5 text-sm text-oak">
              <strong>Preview mode.</strong> Connect Supabase (see README) to enable
              live accounts, saved quotes, payments, points, and galleries. The
              dashboard below shows the structure with sample-empty states.
            </div>
          )}
          <div className="mb-8">
            <p className="text-sm uppercase tracking-widest text-ochre">
              Welcome back
            </p>
            <h1 className="font-display text-4xl text-oak">{name}</h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
