import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/pricing";
import {
  Card,
  CardTitle,
  EmptyState,
  StatusBadge,
} from "@/components/dashboard-ui";
import { AdminActionButton } from "@/components/admin-action-button";
import {
  markPaymentPaid,
  retryQuoteNotification,
  sendQuoteToCustomer,
} from "./actions";

export const metadata = { title: "Admin · Requests" };

export default async function AdminHome() {
  const supabase = createClient();
  if (!supabase) return null; // layout already gates this

  const [{ data: requests }, { data: awaiting }] = await Promise.all([
    supabase
      .from("quotes")
      .select("*")
      .in("status", ["requested", "sent"])
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("*")
      .eq("status", "awaiting")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-10">
      <section>
        <CardTitle>Incoming quote requests</CardTitle>
        <div className="mt-4 space-y-3">
          {!requests?.length ? (
            <EmptyState
              title="No open requests"
              body="New quote requests from customers will appear here for you to confirm and send."
            />
          ) : (
            requests.map((q) => {
              const conditionalServices = Array.isArray(q.conditional_services)
                ? q.conditional_services.filter((item): item is string => typeof item === "string")
                : [];
              return (
              <Card key={q.id} className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl text-oak">{q.requester_name ?? "Quote request"}</p>
                    <p className="text-sm text-soil/50">
                      {q.address ?? "Address unavailable"} ·{" "}
                      {new Date(q.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={q.status} />
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      q.notification_status === "sent"
                        ? "bg-green-100 text-green-800"
                        : q.notification_status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}>
                      Email {q.notification_status}
                    </span>
                  </div>
                </div>

                <dl className="mt-5 grid gap-4 border-t border-oak/10 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <AdminDetail label="Contact email" value={q.requester_email ?? "Not provided"} href={q.requester_email ? `mailto:${q.requester_email}` : undefined} />
                  <AdminDetail label="Account email" value={q.account_email ?? "Not available"} />
                  <AdminDetail label="Phone" value={q.requester_phone ?? "Not provided"} href={q.requester_phone ? `tel:${q.requester_phone}` : undefined} />
                  <AdminDetail label="Quote status" value={Number(q.total) > 0 ? formatCurrency(Number(q.total)) : "Review needed"} />
                  <AdminDetail label="Service" value={q.service_name ?? "Legacy quote"} />
                  <AdminDetail label="Scope details" value={q.scope_details ?? "Not provided"} />
                  <AdminDetail label="Visit rhythm" value={q.frequency ?? "Not selected"} />
                  <AdminDetail label="Review items" value={conditionalServices.join(", ") || "None selected"} />
                </dl>

                {q.notification_error && (
                  <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
                    <strong>Last email error:</strong> {q.notification_error}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-oak/10 pt-5">
                    {q.notification_status !== "sent" && (
                      <AdminActionButton
                        id={q.id}
                        action={retryQuoteNotification}
                        label="Retry notification"
                        doneLabel="Notification sent ✓"
                        variant="outline"
                      />
                    )}
                    {q.status === "requested" && (
                      <AdminActionButton
                        id={q.id}
                        action={sendQuoteToCustomer}
                        label="Send quote"
                        doneLabel="Sent ✓"
                      />
                    )}
                </div>
              </Card>
              );
            })
          )}
        </div>
      </section>

      <section>
        <CardTitle>Payments awaiting confirmation</CardTitle>
        <div className="mt-4 space-y-3">
          {!awaiting?.length ? (
            <p className="text-sm text-soil/50">No payments awaiting.</p>
          ) : (
            awaiting.map((p) => (
              <Card key={p.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="capitalize text-oak">
                      {p.method} · {formatCurrency(Number(p.amount))}
                    </p>
                    <p className="text-sm text-soil/50">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <AdminActionButton
                    id={p.id}
                    action={markPaymentPaid}
                    label="Mark paid"
                    doneLabel="Paid ✓"
                    variant="outline"
                  />
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function AdminDetail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-soil/45">{label}</dt>
      <dd className="mt-1 break-words font-medium text-oak">
        {href ? <a className="text-cinnamon hover:underline" href={href}>{value}</a> : value}
      </dd>
    </div>
  );
}
