import type { getCurrentUser } from "@/lib/data";
import type { QuoteAccount } from "@/components/quote/quote-builder";

type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

/**
 * Maps the signed-in user + profile to the contact details the QuoteBuilder
 * prefills. Returns null for signed-out visitors so the builder keeps its
 * public lead-capture behaviour. Name/email/phone come from the profile, with
 * the auth email as a fallback when the profile row is missing them.
 */
export function accountFromUser(user: CurrentUser): QuoteAccount | null {
  if (!user) return null;
  const profile = user.profile;
  return {
    signedIn: true,
    fullName: profile?.full_name?.trim() ?? "",
    email: (profile?.email ?? user.email ?? "").trim(),
    phone: profile?.phone?.trim() ?? "",
  };
}
