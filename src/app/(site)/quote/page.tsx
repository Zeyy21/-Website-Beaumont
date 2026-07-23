import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { QuoteResumeAnchor } from "@/components/quote/quote-resume-anchor";
import { Container } from "@/components/ui";
import { getCurrentUser, getServices } from "@/lib/data";
import { getDict } from "@/lib/i18n/server";
import { accountFromUser } from "@/lib/quote-account";

export function generateMetadata(): Metadata {
  const { quotePage } = getDict();
  return {
    title: quotePage.metaTitle,
    description: quotePage.metaDescription,
  };
}

/**
 * The standalone quote route is used by header CTAs and by the post-sign-up
 * return URL. Keeping the same builder here lets a saved request resume after
 * authentication without relying on the homepage section being mounted.
 */
export default async function QuotePage() {
  const [services, user] = await Promise.all([getServices(), getCurrentUser()]);

  return (
    <main id="estimate" className="luxe-wash min-h-screen scroll-mt-24 pb-24 pt-32 md:pb-32 md:pt-36">
      <QuoteResumeAnchor />
      <Container>
        <div className="mx-auto max-w-[96rem]">
          <QuoteBuilder services={services} account={accountFromUser(user)} />
        </div>
      </Container>
    </main>
  );
}
