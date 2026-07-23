import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { getFunnelCopy } from "@/lib/funnels/copy";
import { BeforeAfter } from "@/components/before-after";
import { FunnelHeader } from "@/components/funnel/funnel-header";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { FunnelQuoteSection } from "@/components/funnel/funnel-quote-section";
import styles from "@/components/funnel/funnel.module.css";

/**
 * /getquote — direct-response funnel (funnel 2). No video: straight from the
 * promise to before/after proof, a "how a visit runs" reassurance block, then
 * the quote band. Unlisted and noindex; reached from paid ads only.
 */
export function generateMetadata(): Metadata {
  const t = getFunnelCopy(getLocale()).getquote;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default function GetQuotePage() {
  const locale = getLocale();
  const copy = getFunnelCopy(locale);
  const t = copy.getquote;

  return (
    <div className={styles.page}>
      <FunnelHeader shared={copy.shared} locale={locale} path="/getquote" />

      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>{t.heroEyebrow}</p>
            <h1>{t.heroTitle}</h1>
            <p className={styles.lede}>{t.heroLede}</p>
            <div className={styles.heroCta}>
              <a className={styles.btn} href="#quote">
                {t.ctaLabel}
              </a>
              <span className={styles.micro}>{t.ctaMicro}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.secHead}>
              <p className={styles.eyebrow}>{t.baEyebrow}</p>
              <h2>{t.baTitle}</h2>
            </div>
            <BeforeAfter
              className={styles.baMount}
              beforeUrl="/images/pressure-washing-before.png"
              afterUrl="/images/pressure-washing-after.png"
              beforeLabel={copy.shared.before}
              afterLabel={copy.shared.after}
              immersive
              autoSweep
            />
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.wrap}>
            <div className={styles.secHead}>
              <p className={styles.eyebrow}>{t.visitEyebrow}</p>
              <h2>{t.visitTitle}</h2>
            </div>
            <div className={styles.trust}>
              {t.trust.map((item) => (
                <article key={item.h3}>
                  <h3>{item.h3}</h3>
                  <p>{item.p}</p>
                </article>
              ))}
            </div>
            <div className={styles.surfaces}>
              {t.surfaces.map((surface) => (
                <span key={surface}>{surface}</span>
              ))}
            </div>
          </div>
        </section>

        <FunnelQuoteSection
          eyebrow={t.quoteEyebrow}
          title={t.quoteTitle}
          lede={t.quoteLede}
          notes={t.notes}
          form={copy.shared.form}
          locale={locale}
          source="getquote"
        />
      </main>

      <FunnelFooter shared={copy.shared} />
    </div>
  );
}
