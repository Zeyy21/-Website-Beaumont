import Image from "next/image";
import { localeUrls, type Locale } from "@/lib/i18n/config";
import type { FunnelShared } from "@/lib/funnels/copy";
import styles from "./funnel.module.css";

/**
 * Minimal funnel top bar: wordmark, phone, and an EN/FR toggle that links to
 * the same path on the other language's domain (English → beaumontgroup.net,
 * French → groupebeaumont.net), matching how the main site switches language.
 */
export function FunnelHeader({
  shared,
  locale,
  path,
}: {
  shared: FunnelShared;
  locale: Locale;
  path: string;
}) {
  const other: Locale = locale === "en" ? "fr" : "en";
  const otherLabel = other.toUpperCase();
  const otherHref = `${localeUrls[other]}${path}`;

  return (
    <header className={styles.bar}>
      <div className={styles.wrap}>
        <a href={localeUrls[locale]} aria-label="Beaumont">
          <Image
            src="/brand/wordmark-ivory.png"
            alt="Beaumont"
            width={210}
            height={56}
            priority
            style={{ height: 34, width: "auto" }}
          />
        </a>
        <nav className={styles.barRight}>
          <a href={shared.phoneHref}>{shared.phone}</a>
          <a className={styles.lang} href={otherHref} hrefLang={other}>
            {otherLabel}
          </a>
        </nav>
      </div>
    </header>
  );
}
