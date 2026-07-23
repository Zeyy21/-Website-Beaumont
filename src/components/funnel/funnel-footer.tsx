import Image from "next/image";
import { site } from "@/lib/config";
import type { FunnelShared } from "@/lib/funnels/copy";
import styles from "./funnel.module.css";

/** Minimal funnel footer — brand mark, contact, and fine print. */
export function FunnelFooter({ shared }: { shared: FunnelShared }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div>
          <Image
            src="/brand/wordmark-ivory.png"
            alt="Beaumont"
            width={190}
            height={51}
            style={{ height: 30, width: "auto" }}
          />
          <p className={styles.fine}>{shared.footerTagline}</p>
        </div>
        <div>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>
            <a href={site.instagram}>{shared.footerInstagram}</a>
          </p>
          <p className={styles.fine}>{shared.footerRights}</p>
        </div>
      </div>
    </footer>
  );
}
