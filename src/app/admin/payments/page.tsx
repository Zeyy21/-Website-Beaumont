import Link from "next/link";
import { AdminActionButton } from "@/components/admin-action-button";
import { Card, CardTitle, EmptyState, StatCard, StatusBadge } from "@/components/dashboard-ui";
import { ButtonLink } from "@/components/ui";
import { getAdminPayments, quoteHref } from "@/lib/admin-quotes";
import { formatCurrency } from "@/lib/pricing";
import { markPaymentPaid } from "@/app/admin/actions";

export const metadata = { title: "Admin - Payments" };

export default async function AdminPaymentsPage() {
  const payments = await getAdminPayments();
  const awaiting = payments.filter((payment) => payment.status === "awaiting");
  const paid = payments.filter((payment) => payment.status === "paid");
  const paidTotal = paid.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <CardTitle>Payments</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-soil/60">
            Confirm cash and e-transfer payments, then keep quote/job records in
            sync.
          </p>
        </div>
        <ButtonLink href="/admin/jobs" variant="outline" size="sm">
          Jobs
        </ButtonLink>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Awaiting" value={String(awaiting.length)} />
        <StatCard label="Paid" value={String(paid.length)} />
        <StatCard label="Paid total" value={formatCurrency(paidTotal)} />
      </div>

      {!payments.length ? (
        <EmptyState
          title="No payments yet"
          body="Customer payments will appear here once created."
        />
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-medium capitalize text-oak">
                    {payment.method} - {formatCurrency(Number(payment.amount))}
                  </p>
                  <p className="mt-1 text-sm text-soil/50">
                    Created {formatDate(payment.created_at)}
                    {payment.paid_at ? ` - Paid ${formatDate(payment.paid_at)}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={payment.status} />
                  {payment.quote_id && (
                    <Link
                      href={quoteHref(payment.quote_id)}
                      className="text-sm font-medium text-cinnamon hover:underline"
                    >
                      Open quote
                    </Link>
                  )}
                  {payment.status === "awaiting" && (
                    <AdminActionButton
                      id={payment.id}
                      action={markPaymentPaid}
                      label="Mark paid"
                      doneLabel="Paid"
                      variant="outline"
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
