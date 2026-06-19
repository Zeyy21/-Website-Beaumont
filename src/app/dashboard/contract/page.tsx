import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { EmptyState } from "@/components/dashboard-ui";
import { ContractCard } from "@/components/contract-card";

export const metadata = { title: "Contract" };

export default async function ContractPage() {
  const user = await getCurrentUser();
  const data = user ? await getDashboardData(user.id) : null;
  const contracts = data?.contracts ?? [];

  if (contracts.length === 0) {
    return (
      <EmptyState
        title="No contract yet"
        body="When you accept a quote, your service agreement will appear here to review and e-sign."
        ctaHref="/dashboard/quotes"
        ctaLabel="View quotes"
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
