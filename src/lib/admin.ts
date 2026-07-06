import { getCurrentUser } from "@/lib/data";
import { supabaseConfigured } from "@/lib/supabase/env";

export interface AdminGate {
  /** True when the visitor is a signed-in staff member. */
  allowed: boolean;
  /** Why access is blocked, for a friendly message. */
  reason: "no-backend" | "signed-out" | "not-staff" | null;
}

/** Determines whether the current request may use the admin panel. */
export async function adminGate(): Promise<AdminGate> {
  if (!supabaseConfigured) return { allowed: false, reason: "no-backend" };
  const user = await getCurrentUser();
  if (!user) return { allowed: false, reason: "signed-out" };
  if (user.profile?.role !== "staff")
    return { allowed: false, reason: "not-staff" };
  return { allowed: true, reason: null };
}
