import Link from "next/link";
import { nav, site } from "@/lib/config";
import { getDict } from "@/lib/i18n/server";
import { ButtonLink, Container, Wordmark } from "./ui";

export function SiteFooter() {
  const dict = getDict();
  return (
    <footer data-header-tone="dark" className="texture-soil overflow-hidden text-ivory">
      <Container className="py-16 md:py-20">
        <div className="grid gap-14 border-b border-ivory/10 pb-14 lg:grid-cols-[1.15fr_.85fr] lg:gap-24 lg:pb-20">
          <div>
            <Wordmark className="h-9 md:h-11" />
            <p className="mt-7 max-w-lg text-base font-medium leading-relaxed text-ivory/60 md:text-lg">{dict.site.description}</p>
            <ButtonLink href="/#quote" variant="light" size="lg" className="mt-9">
              {dict.footer.beginEstimate} <span aria-hidden="true">↗</span>
            </ButtonLink>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ochre">{dict.footer.explore}</h3>
              <ol className="mt-6 space-y-4">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="group flex items-center gap-3 text-sm font-medium text-ivory/65 transition-colors hover:text-ivory">
                      <span className="h-px w-5 bg-ochre/60 transition-all group-hover:w-8" />
                      {dict.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ochre">{dict.footer.contact}</h3>
              <ul className="mt-6 space-y-5 text-sm font-medium text-ivory/65">
                <li>
                  <a href={`mailto:${site.email}`} className="transition-colors hover:text-ivory break-words">{site.email}</a>
                </li>
                <li>
                  <a href={site.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-ivory">Instagram · {site.instagramHandle}</a>
                </li>
                <li>
                  <Link href="/login" className="transition-colors hover:text-ivory">{dict.footer.clientSignIn}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-7 text-xs font-medium text-ivory/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {site.name}. {dict.site.promise}</p>
          <div className="flex flex-wrap gap-6">
            <span>{dict.common.montreal}</span>
            <Link href="/terms" className="transition-colors hover:text-ivory">{dict.footer.termsLink}</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
