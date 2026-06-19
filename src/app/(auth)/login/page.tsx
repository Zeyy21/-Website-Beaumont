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
  searchParams: { next?: string };
}) {
  // Already signed in? Skip the form.
  const user = await getCurrentUser();
  if (user) redirect(searchParams.next ?? "/dashboard");

  return (
    <AuthForm enabled={supabaseConfigured} next={searchParams.next ?? "/dashboard"} />
  );
}
