"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/lib/config";
import { cn } from "@/lib/cn";
import { ButtonLink, Container, Monogram } from "./ui";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-oak/10 bg-ivory/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${site.name} home`}
        >
          <Monogram size={34} dark />
          <span className="font-display text-xl tracking-[0.18em] text-oak">
            BEAUMONT
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors",
                  active ? "text-oak" : "text-soil/70 hover:text-oak",
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-oak/8"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href={signedIn ? "/dashboard" : "/login"} variant="ghost" size="sm">
            {signedIn ? "Dashboard" : "Sign in"}
          </ButtonLink>
          <ButtonLink href="/quote" size="sm">
            Instant Quote
          </ButtonLink>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-oak md:hidden"
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
