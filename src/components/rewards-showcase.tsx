"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container, Eyebrow, ButtonLink } from "@/components/ui";
import { rewards } from "@/lib/config";

const tiers = [
  { label: "Create an account", points: rewards.signup },
  { label: "Accept a quote", points: rewards.quoteAccepted },
  { label: "Completed job", points: rewards.jobCompleted },
  { label: "Successful referral", points: rewards.referralSuccess },
];

export function RewardsShowcase({ referralPoints }: { referralPoints: number }) {
  const reduce = useReducedMotion();

  return (
    <section className="py-16">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-oak/10 bg-gradient-to-br from-oak to-soil px-8 py-16 text-ivory md:px-16">
          {/* floating point chips */}
          {!reduce && (
            <div className="pointer-events-none absolute inset-0">
              {[
                { t: "+100", x: "12%", y: "22%", d: 0 },
                { t: "+250", x: "82%", y: "18%", d: 0.6 },
                { t: "+500", x: "70%", y: "70%", d: 1.2 },
                { t: "+1000", x: "18%", y: "72%", d: 1.8 },
              ].map((c) => (
                <motion.span
                  key={c.t}
                  className="absolute rounded-full border border-sand/30 bg-sand/10 px-3 py-1 font-display text-sm text-sand backdrop-blur-sm"
                  style={{ left: c.x, top: c.y }}
                  animate={{ y: [0, -14, 0], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: c.d,
                    ease: "easeInOut",
                  }}
                >
                  {c.t} pts
                </motion.span>
              ))}
            </div>
          )}

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Beaumont Rewards</Eyebrow>
              <h2 className="mt-4 text-4xl md:text-5xl">Every clean earns you more</h2>
              <p className="mt-5 max-w-md text-ivory/70">
                Collect points on signup, completed jobs, and referrals, then
                redeem them as a discount on future visits. Refer a friend and
                you both earn {referralPoints.toLocaleString()} points.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/login" variant="light" size="lg">
                  Create your account
                </ButtonLink>
                <ButtonLink
                  href="/quote"
                  size="lg"
                  className="border border-ivory/25 bg-transparent text-ivory hover:bg-ivory hover:text-soil"
                >
                  Start a quote
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-3xl border border-ivory/10 bg-ivory/5 p-6 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-widest text-sand">
                How you earn
              </p>
              <ul className="mt-4 space-y-3">
                {tiers.map((t, i) => (
                  <motion.li
                    key={t.label}
                    initial={reduce ? false : { opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-center justify-between rounded-xl bg-ivory/5 px-4 py-3"
                  >
                    <span className="text-ivory/80">{t.label}</span>
                    <span className="font-display text-lg text-sand">
                      +{t.points.toLocaleString()}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
