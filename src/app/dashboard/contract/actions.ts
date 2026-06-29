"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDict } from "@/lib/i18n/server";

/** Customer acknowledges/e-signs a contract from within their profile. */
export async function signContract(contractId: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  const t = getDict().dashboard.contract;
  const supabase = createClient();
  if (!supabase) return { ok: false, error: t.errNotEnabled };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: t.errSignIn };

  const { error } = await supabase
    .from("contracts")
    .update({ status: "signed", signed_at: new Date().toISOString() })
    .eq("id", contractId)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/contract");
  return { ok: true };
}
