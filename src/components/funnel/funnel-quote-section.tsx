import type { Locale } from "@/lib/i18n/config";
import type { FunnelForm } from "@/lib/funnels/copy";
import { FunnelQuoteForm } from "./funnel-quote-form";
import styles from "./funnel.module.css";

interface Note {
  h3: string;
  p: string;
}

/**
 * The canopy quote band shared by both funnels: reassurance notes on the left,
 * the live lead form on the right. `#quote` anchor targets the hero CTA.
 */
export function FunnelQuoteSection({
  eyebrow,
  title,
  lede,
  notes,
  form,
  locale,
  source,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  notes: Note[];
  form: FunnelForm;
  locale: Locale;
  source: "getquote" | "learnmore";
}) {
  return (
    <section className={`${styles.section} ${styles.quote}`} id="quote">
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
        <p className={styles.lede}>{lede}</p>
        <div className={styles.qGrid}>
          <div className={styles.qNotes}>
            {notes.map((note) => (
              <div key={note.h3}>
                <h3>{note.h3}</h3>
                <p>{note.p}</p>
              </div>
            ))}
          </div>
          <FunnelQuoteForm copy={form} locale={locale} source={source} />
        </div>
      </div>
    </section>
  );
}
