"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/lib/config";
import { cn } from "@/lib/cn";
import { ButtonLink, Container, Wordmark } from "./ui";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const home = pathname === "/";

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > (home ? window.innerHeight * 1.92 : 12));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => setOpen(false), [pathname]);

  const onDark = home && !scrolled && !open;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        onDark
          ? "border-b border-transparent bg-transparent text-ivory"
          : "border-b border-oak/10 bg-ivory/90 text-soil backdrop-blur-md",
      )}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="group flex items-center"
          aria-label={`${site.name} home`}
        >
          <Wordmark dark={!onDark} priority className="h-8 w-auto transition-opacity duration-300 group-hover:opacity-70 md:h-11 lg:h-12" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors",
                  onDark
                    ? active
                      ? "text-ivory"
                      : "text-ivory/70 hover:text-ivory"
                    : active
                      ? "text-oak"
                      : "text-soil/70 hover:text-oak",
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full",
                      onDark ? "bg-ivory/10" : "bg-oak/8",
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink
            href={signedIn ? "/dashboard" : "/login"}
            variant="ghost"
            size="sm"
            className={onDark ? "text-ivory hover:bg-ivory/10" : undefined}
          >
            {signedIn ? "Dashboard" : "Sign in"}
          </ButtonLink>
          <ButtonLink href="/quote" size="sm" variant={onDark ? "light" : "primary"}>
            Instant Quote
          </ButtonLink>
        </div>

        <button
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full md:hidden",
            onDark ? "text-ivory" : "text-oak",
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-oak/10 bg-ivory md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-base text-soil hover:bg-oak/5"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 px-1">
                <ButtonLink
                  href={signedIn ? "/dashboard" : "/login"}
                  variant="outline"
                  className="flex-1"
                >
                  {signedIn ? "Dashboard" : "Sign in"}
                </ButtonLink>
                <ButtonLink href="/quote" className="flex-1">
                  Quote
                </ButtonLink>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
