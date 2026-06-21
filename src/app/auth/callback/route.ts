import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

/** Exchange OAuth, email-confirmation, or magic-link codes for a cookie session. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const origin = request.nextUrl.origin;

  if (!code) return NextResponse.redirect(`${origin}/login?error=missing-code`);
  const supabase = createClient();
  if (!supabase) return NextResponse.redirect(`${origin}/login?error=disabled`);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=auth&message=${encodeURIComponent(error.message)}`,
    );
  }
  return NextResponse.redirect(`${origin}${next}`);
}
