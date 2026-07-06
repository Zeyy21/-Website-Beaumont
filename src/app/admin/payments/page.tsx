import Link from "next/link";
import { AdminActionButton } from "@/components/admin-action-button";
import { Card, CardTitle, EmptyState, StatCard, StatusBadge } from "@/components/dashboard-ui";
import { ButtonLink } from "@/components/ui";
import { getAdminPayments, quoteHref } from "@/lib/admin-quotes";
import { formatCurrency } from "@/lib/pricing";
import { markPaymentPaid } from "@/app/admin/actions";
import { getDict } from "@/lib/i18n/server";
import { statusLabel } from "@/lib/i18n/dictionaries";

export function generateMetadata() {
  return { title: `${getDict().admin.payments.title}${getDict().common.brandSuffix}` };
}

export default async function AdminPaymentsPage() {
  const dict = getDict();
  const t = dict.admin.payments;
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
          <CardTitle>{t.title}</CardTitle>
          <p className="mt-1 max-w-2xl text-sm text-soil/60">
            {t.description}
          </p>
        </div>
        <ButtonLink href="/admin/jobs" variant="outline" size="sm">
          {t.jobs}
        </ButtonLink>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label={t.awaiting} value={String(awaiting.length)} />
        <StatCard label={t.paid} value={String(paid.length)} />
        <StatCard label={t.paidTotal} value={formatCurrency(paidTotal)} />
      </div>

      {!payments.length ? (
        <EmptyState
          title={t.noPaymentsTitle}
          body={t.noPaymentsBody}
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
                    {t.createdPrefix}{formatDate(payment.created_at)}
                    {payment.paid_at ? ` - ${t.paidPrefix}${formatDate(payment.paid_at)}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={payment.status} label={statusLabel(dict, payment.status)} />
                  {payment.quote_id && (
                    <Link
                      href={quoteHref(payment.quote_id)}
                      className="text-sm font-medium text-cinnamon hover:underline"
                    >
                      {t.openQuote}
                    </Link>
                  )}
                  {payment.status === "awaiting" && (
                    <AdminActionButton
                      id={payment.id}
                      action={markPaymentPaid}
                      label={t.markPaid}
                      doneLabel={dict.admin.payments.paid}
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
