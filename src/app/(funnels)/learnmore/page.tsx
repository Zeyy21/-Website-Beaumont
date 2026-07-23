import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { getFunnelCopy } from "@/lib/funnels/copy";
import { BeforeAfter } from "@/components/before-after";
import { FunnelHeader } from "@/components/funnel/funnel-header";
import { FunnelFooter } from "@/components/funnel/funnel-footer";
import { FunnelQuoteSection } from "@/components/funnel/funnel-quote-section";
import styles from "@/components/funnel/funnel.module.css";

/**
 * /learnmore — education-first funnel (funnel 1). A 4-minute explainer video,
 * the "in plain terms" breakdown, before/after proof, then the quote band.
 * Unlisted and noindex; reached from paid ads only.
 */
export function generateMetadata(): Metadata {
  const t = getFunnelCopy(getLocale()).learnmore;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default function LearnMorePage() {
  const locale = getLocale();
  const copy = getFunnelCopy(locale);
  const t = copy.learnmore;

  return (
    <div className={styles.page}>
      <FunnelHeader shared={copy.shared} locale={locale} path="/learnmore" />

      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>{t.heroEyebrow}</p>
            <h1>{t.heroTitle}</h1>
            <p className={styles.lede}>{t.heroLede}</p>
            <div className={styles.videoShell}>
              {/* Replace src with the final 4-minute soft washing film before launch */}
              <video
                src="/video/hero-beaumont.mp4"
                controls
                preload="metadata"
                playsInline
              />
            </div>
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
              <p className={styles.eyebrow}>{t.plainEyebrow}</p>
              <h2>{t.plainTitle}</h2>
            </div>
            <div className={styles.rows}>
              {t.rows.map((row) => (
                <div className={styles.row} key={row.num}>
                  <span className={styles.num}>{row.num}</span>
                  <h3>{row.h3}</h3>
                  <p>{row.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: 0 }}>
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

        <FunnelQuoteSection
          eyebrow={t.quoteEyebrow}
          title={t.quoteTitle}
          lede={t.quoteLede}
          notes={t.notes}
          form={copy.shared.form}
          locale={locale}
          source="learnmore"
        />
      </main>

      <FunnelFooter shared={copy.shared} />
    </div>
  );
}
