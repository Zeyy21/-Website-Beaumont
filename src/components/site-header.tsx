"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/config";
import { cn } from "@/lib/cn";
import { ButtonLink, Container, Wordmark } from "./ui";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-transparent text-ivory">
      <Container className="flex h-[72px] items-center justify-between gap-3">
        <Link href="/" className="flex h-11 items-center rounded-full border border-ivory/15 bg-soil/88 px-4 shadow-soft backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand" aria-label={`${site.name} home`}>
          <Wordmark priority className="text-[1.45rem] md:text-[1.65rem]" />
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full border border-ivory/15 bg-soil/88 p-1 shadow-soft backdrop-blur-md md:flex" aria-label="Primary navigation">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium text-ivory/72 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand", active && "bg-ivory/14 text-ivory")}>{item.label}</Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href={signedIn ? "/dashboard" : "/login"} size="sm" className="border border-ivory/15 bg-soil/88 text-ivory shadow-soft backdrop-blur-md hover:bg-soil">{signedIn ? "Dashboard" : "Sign in"}</ButtonLink>
          <ButtonLink href="/quote" size="sm" variant="light" className="shadow-soft">Instant Quote</ButtonLink>
        </div>

        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 bg-soil/88 text-ivory shadow-soft backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </Container>

      {open && (
        <div className="absolute inset-x-4 top-[64px] overflow-hidden rounded-2xl border border-ivory/15 bg-soil/96 p-3 shadow-lift backdrop-blur-xl md:hidden">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={cn("rounded-xl px-4 py-3 text-base font-medium text-ivory/75 hover:bg-ivory/10 hover:text-ivory", pathname === item.href && "bg-ivory/10 text-ivory")}>{item.label}</Link>
            ))}
          </nav>
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-ivory/10 pt-3">
            <ButtonLink href={signedIn ? "/dashboard" : "/login"} className="border border-ivory/20 bg-transparent text-ivory">{signedIn ? "Dashboard" : "Sign in"}</ButtonLink>
            <ButtonLink href="/quote" variant="light">Quote</ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
