import { createClient } from "@/lib/supabase/server";
import { CardTitle, EmptyState } from "@/components/dashboard-ui";
import { PricingEditor } from "@/components/pricing-editor";

export const metadata = { title: "Admin - Pricing" };

export default async function AdminPricing() {
  const supabase = createClient();
  if (!supabase) return null;

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("sort", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <CardTitle>Pricing</CardTitle>
        <p className="mt-1 text-sm text-soil/60">
          Edit internal pricing fields for each service. Customer requests stay review-based until a final quote is confirmed.
        </p>
      </div>

      {!services?.length ? (
        <EmptyState
          title="No services"
          body="Run the database migration to seed the service catalogue."
        />
      ) : (
        services.map((s) => (
          <PricingEditor
            key={s.id}
            service={{
              id: s.id,
              name: s.name,
              base_price: Number(s.base_price),
              rate_per_m2: Number(s.rate_per_m2),
              multiplier: Number(s.multiplier),
            }}
          />
        ))
      )}
    </div>
  );
}
