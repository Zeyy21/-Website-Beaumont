import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in or create your Beaumont account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; message?: string };
}) {
  // Already signed in? Skip the form.
  const user = await getCurrentUser();
  if (user) redirect(searchParams.next ?? "/");

  const fallbackErrors: Record<string, string> = {
    disabled: "Supabase is not configured in this local build.",
    auth: "That sign-in link could not be completed. It may have expired.",
    oauth: "Google sign-in could not be completed.",
    "missing-code": "The sign-in link is missing its authorization code.",
  };

  return (
    <AuthForm
      enabled={supabaseConfigured}
      next={searchParams.next ?? "/"}
      initialError={searchParams.message ?? (searchParams.error ? fallbackErrors[searchParams.error] : undefined)}
    />
  );
}
