import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/pricing";
import { stripeEnabled } from "@/lib/payments";
import { Card, CardTitle, EmptyState, StatusBadge } from "@/components/dashboard-ui";
import { PayPanel } from "@/components/pay-panel";

export const metadata = { title: "Payments" };

export default async function PaymentsPage() {
  const user = await getCurrentUser();
  const data = user
    ? await getDashboardData(user.id)
    : null;

  const payments = data?.payments ?? [];
  // Accepted/scheduled quotes that have no payment yet → payable.
  const payable =
    data?.quotes.filter(
      (q) =>
        ["accepted", "scheduled"].includes(q.status) &&
        !payments.some((p) => p.quote_id === q.id),
    ) ?? [];

  return (
    <div className="space-y-8">
      <section>
        <CardTitle>Outstanding</CardTitle>
        <div className="mt-4 space-y-4">
          {payable.length === 0 ? (
            <EmptyState
              title="Nothing to pay"
              body="When you accept a quote, you can settle it here by card, transfer, or cash."
              ctaHref="/dashboard/quotes"
              ctaLabel="View quotes"
            />
          ) : (
            payable.map((q) => (
              <Card key={q.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-oak">{q.address ?? "Service"}</p>
                    <p className="text-sm text-soil/50">
                      {formatCurrency(Number(q.total))}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-oak/10 pt-4">
                  <PayPanel
                    quoteId={q.id}
                    amount={Number(q.total)}
                    cardEnabled={stripeEnabled}
                  />
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      <section>
        <CardTitle>Payment history</CardTitle>
        <div className="mt-4">
          {payments.length === 0 ? (
            <p className="text-sm text-soil/50">No payments recorded yet.</p>
          ) : (
            <Card>
              <ul className="divide-y divide-oak/10">
                {payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="capitalize text-oak">{p.method}</p>
                      <p className="text-sm text-soil/50">
                        {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-lg text-oak">
                        {formatCurrency(Number(p.amount))}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
