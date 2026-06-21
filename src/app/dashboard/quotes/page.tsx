import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/pricing";
import { Card, EmptyState, StatusBadge } from "@/components/dashboard-ui";
import type { LineItem } from "@/lib/supabase/types";

export const metadata = { title: "Quotes" };

export default async function QuotesPage() {
  const user = await getCurrentUser();
  const data = user
    ? await getDashboardData(user.id)
    : { quotes: [] as Awaited<ReturnType<typeof getDashboardData>>["quotes"] };

  if (data.quotes.length === 0) {
    return (
      <EmptyState
        title="No quotes yet"
        body="Your saved and requested quotes will appear here. Start by drawing your space."
        ctaHref="/dashboard/quotes/new"
        ctaLabel="Get an instant quote"
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.quotes.map((q) => {
        const items = Array.isArray(q.line_items)
          ? (q.line_items as unknown as LineItem[])
          : [];
        return (
          <Card key={q.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg text-oak">{q.address ?? "Quote"}</h2>
                <p className="text-sm text-soil/50">
                  {q.area_m2 ? `${q.area_m2} m² · ` : ""}
                  {q.frequency ?? ""} ·{" "}
                  {new Date(q.created_at).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={q.status} />
            </div>

            {items.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-oak/10 pt-4">
                {items.map((li, i) => (
                  <li
                    key={i}
                    className="flex justify-between text-sm text-soil/70"
                  >
                    <span>{li.label}</span>
                    <span className="tabular-nums">
                      {formatCurrency(Number(li.amount))}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-oak/10 pt-4">
              <span className="text-soil/60">Total</span>
              <span className="font-display text-2xl text-oak">
                {formatCurrency(Number(q.total))}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
