import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import { StickyQuoteBar } from "@/components/sticky-quote-bar";
import { getCurrentUser } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <>
      <SiteHeader signedIn={Boolean(user)} />
      <PageTransition>{children}</PageTransition>
      <SiteFooter />
      <StickyQuoteBar />
    </>
  );
}
