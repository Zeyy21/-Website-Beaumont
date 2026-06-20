import type { Metadata } from "next";
import { site } from "@/lib/config";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <section className="py-24">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-4 text-5xl text-oak">Let&apos;s talk</h1>
          <p className="mt-5 max-w-md text-lg text-soil/70">
            The fastest way to a price is our instant quote tool, but we&apos;re
            always happy to hear from you directly.
          </p>
          <dl className="mt-8 space-y-4">
            <div>
              <dt className="text-sm uppercase tracking-widest text-ochre">
                Email
              </dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="text-xl text-oak hover:text-cinnamon"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm uppercase tracking-widest text-ochre">
                Phone
              </dt>
              <dd>
                <a
                  href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                  className="text-xl text-oak hover:text-cinnamon"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
          </dl>
          <ButtonLink href="/quote" size="lg" className="mt-8">
            Start an instant quote
          </ButtonLink>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="texture-soil rounded-3xl p-10 text-ivory">
            <h2 className="font-display text-3xl">Service hours</h2>
            <ul className="mt-6 space-y-3 text-ivory/75">
              <li className="flex justify-between">
                <span>Monday – Friday</span>
                <span>7:00 – 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>8:00 – 16:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>By appointment</span>
              </li>
            </ul>
            <p className="mt-8 text-sm text-ivory/50">
              Quotes and bookings can be made online any time, day or night.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
