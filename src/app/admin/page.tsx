import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/pricing";
import {
  Card,
  CardTitle,
  EmptyState,
  StatusBadge,
} from "@/components/dashboard-ui";
import { AdminActionButton } from "@/components/admin-action-button";
import { sendQuoteToCustomer, markPaymentPaid } from "./actions";

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
            requests.map((q) => (
              <Card key={q.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-oak">{q.address ?? "Quote"}</p>
                    <p className="text-sm text-soil/50">
                      {q.area_m2 ? `${q.area_m2} m² · ` : ""}
                      {q.frequency ?? ""} · {formatCurrency(Number(q.total))} ·{" "}
                      {new Date(q.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={q.status} />
                    {q.status === "requested" && (
                      <AdminActionButton
                        id={q.id}
                        action={sendQuoteToCustomer}
                        label="Send quote"
                        doneLabel="Sent ✓"
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))
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
