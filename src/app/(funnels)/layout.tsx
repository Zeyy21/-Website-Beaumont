import { fraunces, instrumentSans } from "@/app/fonts";

/**
 * Layout for the ad-funnel landing pages. It scopes the funnel typefaces
 * (Fraunces + Instrument Sans) to these routes via next/font CSS variables —
 * the main site keeps Cormorant + Inter. No site header/footer here: funnels
 * use their own minimal chrome so paid traffic has no exits but the CTA.
 */
export default function FunnelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${fraunces.variable} ${instrumentSans.variable}`}>
      {children}
    </div>
  );
}
