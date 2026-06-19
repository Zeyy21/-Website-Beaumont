import type { Metadata } from "next";
import { site } from "@/lib/config";
import { Container, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `${site.name} terms of service, quotes, payments, rewards, and privacy.`,
};

const sections = [
  {
    h: "1. Overview",
    p: [
      `These Terms & Conditions govern your use of the ${site.name} website, instant-quote tools, and cleaning services. By requesting a quote or booking a service, you agree to these terms.`,
    ],
  },
  {
    h: "2. Quotes & estimates",
    p: [
      "Instant estimates are generated from the property area you provide (drawn on the map) and your selected service, frequency, and add-ons. Estimates are indicative and shown as a range.",
      "A formal quote is confirmed by our team after review and may be adjusted for access, condition, or scope discovered on site. You will always be notified before any change to your confirmed price.",
    ],
  },
  {
    h: "3. Bookings & scheduling",
    p: [
      "A booking is confirmed once you accept a formal quote. We will agree a date and arrival window with you in advance. Please ensure safe access to the property at the scheduled time.",
    ],
  },
  {
    h: "4. Payments",
    p: [
      "We accept payment by card, bank transfer, or cash. Card payments are processed securely by our payment provider; we do not store full card details. Transfer and cash payments are recorded against your invoice and marked paid once received.",
      "Invoices not settled within the agreed period may incur a reasonable late fee as permitted by law.",
    ],
  },
  {
    h: "5. Cancellations & rescheduling",
    p: [
      "You may reschedule or cancel up to 24 hours before your appointment at no charge. Cancellations within 24 hours may be subject to a fee to cover allocated time.",
    ],
  },
  {
    h: "6. Satisfaction promise",
    p: [
      "If any area does not meet our standard, tell us within 48 hours and we will return to re-clean the affected area at no cost. This is our sole obligation in respect of service quality.",
    ],
  },
  {
    h: "7. Rewards & referrals",
    p: [
      "Reward points are earned on signup, completed jobs, and successful referrals, and may be redeemed as a discount on future services. Points hold no cash value, are non-transferable, and may expire or change under program updates.",
      "Referral rewards are credited once a referred customer completes a first paid job. Abuse of the program may result in forfeiture of points.",
    ],
  },
  {
    h: "8. Liability",
    p: [
      `${site.name} carries insurance for the services we provide. To the fullest extent permitted by law, our liability is limited to the value of the service in question. We are not liable for pre-existing damage or wear.`,
    ],
  },
  {
    h: "9. Privacy",
    p: [
      "We collect only the information needed to provide quotes and services — such as your address, contact details, and job history. We do not sell your data. Address lookups are processed through privacy-respecting open mapping services.",
    ],
  },
  {
    h: "10. Contact",
    p: [
      `Questions about these terms? Reach us at ${site.email} or ${site.phone}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-4 text-5xl text-oak">Terms & Conditions</h1>
          <p className="mt-4 text-soil/60">
            Last updated {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <Reveal key={s.h}>
              <h2 className="text-2xl text-oak">{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mt-3 text-soil/75">
                  {para}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
