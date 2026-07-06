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
        "rounded-2xl border border-oak/10 bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift",
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

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        !label && "capitalize",
        statusTone[status] ?? "bg-oak/10 text-oak",
      )}
    >
      {label ?? status}
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
    <div className="relative overflow-hidden rounded-2xl border border-oak/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-sand/40 to-transparent" />
      <p className="relative text-sm uppercase tracking-widest text-ochre">
        {label}
      </p>
      <p className="relative mt-2 font-display text-4xl text-oak">{value}</p>
      {sub && <p className="relative mt-1 text-xs text-soil/50">{sub}</p>}
    </div>
  );
}
