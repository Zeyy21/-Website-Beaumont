import Link from "next/link";
import { nav, site } from "@/lib/config";
import { Container, Wordmark } from "./ui";

export function SiteFooter() {
  return (
    <footer className="texture-soil text-ivory">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark className="h-9" />
          <p className="mt-5 max-w-sm text-ivory/80">{site.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ochre">
            Explore
          </h3>
          <ul className="mt-4 space-y-3 text-ivory/85">
            {nav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="transition-colors hover:text-ivory">
                  {i.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className="transition-colors hover:text-ivory">
                Sign in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-ochre">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-ivory/85">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-ivory">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="hover:text-ivory">
                {site.phone}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-ivory/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-sm text-ivory/70 md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.promise}
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-ivory">
              Terms & Conditions
            </Link>
            <Link href="/quote" className="hover:text-ivory">
              Get a quote
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
