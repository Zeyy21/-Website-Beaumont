import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { EmptyState } from "@/components/dashboard-ui";
import { ContractCard } from "@/components/contract-card";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: getDict().dashboard.nav.contract };
}

export default async function ContractPage() {
  const t = getDict().dashboard.contract;
  const user = await getCurrentUser();
  const data = user ? await getDashboardData(user.id) : null;
  const contracts = data?.contracts ?? [];

  if (contracts.length === 0) {
    return (
      <EmptyState
        title={t.noContractTitle}
        body={t.noContractBody}
        ctaHref="/dashboard/quotes"
        ctaLabel={t.viewQuotes}
      />
    );
  }

  return (
    <div className="space-y-6">
      {contracts.map((c) => (
        <ContractCard
          key={c.id}
          contract={{
            id: c.id,
            terms: c.terms,
            status: c.status,
            signed_at: c.signed_at,
            created_at: c.created_at,
          }}
        />
      ))}
    </div>
  );
}
