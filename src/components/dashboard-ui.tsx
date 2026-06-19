import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-oak/10 bg-white p-6 shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl text-oak">{children}</h2>;
}

export function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-oak/20 bg-sand/20 p-10 text-center">
      <p className="font-display text-xl text-oak">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-soil/60">{body}</p>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-cinnamon px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-oak"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

const statusTone: Record<string, string> = {
  draft: "bg-oak/10 text-oak",
  requested: "bg-ochre/20 text-ochre",
  sent: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  scheduled: "bg-green-100 text-green-800",
  completed: "bg-soil/10 text-soil",
  awaiting: "bg-ochre/20 text-ochre",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-oak/10 text-oak",
  signed: "bg-green-100 text-green-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
        statusTone[status] ?? "bg-oak/10 text-oak",
      )}
    >
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <p className="text-sm text-soil/60">{label}</p>
      <p className="mt-1 font-display text-3xl text-oak">{value}</p>
      {sub && <p className="mt-1 text-xs text-soil/50">{sub}</p>}
    </Card>
  );
}
