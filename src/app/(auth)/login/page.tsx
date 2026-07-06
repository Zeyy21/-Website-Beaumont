import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/data";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const dict = getDict();
  return {
    title: dict.auth.metaTitle,
    description: dict.auth.metaDescription,
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; message?: string; mode?: string; quote?: string };
}) {
  // Already signed in? Skip the form. Default landing is the account dashboard.
  const user = await getCurrentUser();
  if (user) redirect(searchParams.next ?? "/dashboard");

  const dict = getDict();
  const fallbackErrors: Record<string, string> = {
    disabled: dict.auth.errDisabledConfig,
    auth: dict.auth.errAuthExpired,
    oauth: dict.auth.errOauth,
    "missing-code": dict.auth.errMissingCode,
  };

  return (
    <AuthForm
      enabled={supabaseConfigured}
      next={searchParams.next ?? "/dashboard"}
      initialMode={searchParams.mode === "signup" ? "signup" : "signin"}
      quoteReady={searchParams.quote === "ready"}
      initialError={searchParams.message ?? (searchParams.error ? fallbackErrors[searchParams.error] : undefined)}
    />
  );
}
