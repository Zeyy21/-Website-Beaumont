"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { signOut } from "@/app/(auth)/login/actions";

const items = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/quotes", label: "Quotes", icon: "doc" },
  { href: "/dashboard/payments", label: "Payments", icon: "card" },
  { href: "/dashboard/contract", label: "Contract", icon: "pen" },
  { href: "/dashboard/rewards", label: "Rewards", icon: "star" },
  { href: "/dashboard/referrals", label: "Referrals", icon: "users" },
  { href: "/dashboard/gallery", label: "My Gallery", icon: "image" },
] as const;

const paths: Record<string, string> = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5",
  card: "M3 6h18v12H3zM3 10h18",
  pen: "M16 3l5 5-11 11H5v-5z",
  star: "M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 18l-5.9 3.1 1.2-6.6L2.5 9.9 9.1 9z",
  users:
    "M16 14a4 4 0 10-8 0M12 7a3 3 0 100-6 3 3 0 000 6M3 21a6 6 0 0118 0",
  image: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6",
};

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Account navigation">
      {items.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative isolate flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
              active ? "text-ivory" : "text-ivory/60 hover:text-ivory",
            )}
          >
            {active && (
              <motion.span
                layoutId="dash-active"
                className="absolute inset-0 -z-10 rounded-full border border-ivory/10 bg-cinnamon shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon name={item.icon} />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}

      <form action={signOut} className="ml-auto shrink-0 pl-2">
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-2.5 rounded-full border border-ivory/10 px-4 py-2.5 text-sm text-ivory/50 transition-colors hover:border-ivory/20 hover:text-ivory"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5V3h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sign out
        </button>
      </form>
    </nav>
  );
}
