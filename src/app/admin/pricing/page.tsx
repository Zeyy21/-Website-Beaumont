import { createClient } from "@/lib/supabase/server";
import { CardTitle, EmptyState } from "@/components/dashboard-ui";
import { PricingEditor } from "@/components/pricing-editor";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: `${getDict().admin.pricing.title}${getDict().common.brandSuffix}` };
}

export default async function AdminPricing() {
  const t = getDict().admin.pricing;
  const supabase = createClient();
  if (!supabase) return null;

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("sort", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <CardTitle>{t.title}</CardTitle>
        <p className="mt-1 text-sm text-soil/60">
          {t.description}
        </p>
      </div>

      {!services?.length ? (
        <EmptyState
          title={t.noServicesTitle}
          body={t.noServicesBody}
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
