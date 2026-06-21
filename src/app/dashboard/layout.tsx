import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/env";
import { DashboardNav } from "@/components/dashboard-nav";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Container } from "@/components/ui";
import { rewards } from "@/lib/config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (supabaseConfigured && !user) redirect("/login?next=/dashboard");

  const points = user?.profile?.points_balance ?? 0;
  const name = user?.profile?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <>
      <SiteHeader signedIn={Boolean(user)} />
      <main className="luxe-wash min-h-screen py-8 md:py-14">
        <Container>
          <section className="overflow-hidden rounded-[2rem] border border-oak/10 bg-ivory/80 shadow-[0_35px_100px_-55px_rgba(29,23,15,.75)] backdrop-blur-sm md:rounded-[3rem]">
            <header className="texture-soil relative overflow-hidden p-6 text-ivory md:p-10 lg:p-12">
              <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-24 font-display text-[18rem] leading-none text-ivory/[0.025]">B</div>
              <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-sand">Private client area</p>
                  <h1 className="mt-4 font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.9]">
                    Welcome back,
                    <span className="block italic text-sand">{name}.</span>
                  </h1>
                </div>

                {supabaseConfigured && (
                  <div className="min-w-[13rem] rounded-[1.5rem] border border-ivory/10 bg-ivory/[0.055] p-5 backdrop-blur-sm">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-ivory/45">Reward balance</p>
                    <p className="mt-2 font-display text-4xl text-sand">{points.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-ivory/45">≈ ${(points / rewards.pointsPerDollar).toFixed(0)} toward your next visit</p>
                  </div>
                )}
              </div>

              <div className="relative mt-9 border-t border-ivory/10 pt-5">
                <DashboardNav />
              </div>
            </header>

            <div className="p-6 md:p-10 lg:p-12">
              {!supabaseConfigured && (
                <div className="mb-8 rounded-2xl border border-ochre/25 bg-sand/25 p-5 text-sm text-oak">
                  <strong>Preview mode.</strong> Connect Supabase to enable live accounts, saved quotes, payments, rewards, and galleries.
                </div>
              )}
              <div className="mx-auto max-w-5xl">{children}</div>
            </div>
          </section>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
